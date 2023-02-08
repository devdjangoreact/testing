import pty, select, signal
import os, struct, fcntl, termios
import subprocess, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

fd = None
child_pid = None
max_read_bytes = 1024 * 20


class ShellConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        global fd
        global child_pid
        
        # if child_pid:
        #     os.write(fd, "\n".encode())
        #     return

        child_pid, fd = pty.fork()
   
        if child_pid == 0:
            subprocess.run('bash')
        else:
            asyncio.ensure_future(self.background_task())    
     
    
    async def background_task(self):
        rlist = True
        while True:
            await asyncio.sleep(0.1)
            timeout_sec = 0
            rlist, _, _ = select.select([fd], [], [], timeout_sec)
            if fd in rlist:
                
                try:
                    data = os.read(fd, max_read_bytes)
                except:
                    data = ""
                    
                if data:
                    await self.send(text_data=data.decode())
                    winsize = struct.pack("")
                    fcntl.ioctl(fd, termios.TIOCSWINSZ, winsize)   
           
    
    async def disconnect(self, message=""):
        global child_pid
        try:
            os.kill(child_pid,signal.SIGKILL)
            os.wait()
        except:
            ""

      
    async def receive(self, text_data):
        global fd
        if text_data=="disconnect":
            await self.disconnect(message="")
            return
           
        if text_data=="connect":
            await self.connect()
            return
    
        if text_data:
            os.write(fd, text_data.encode())
      
