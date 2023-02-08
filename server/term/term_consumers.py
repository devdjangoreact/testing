import subprocess
import os
import re
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class TerminalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.cwd = os.getcwd() 
        await self.accept()
        
    async def disconnect(self, close_code):
        await self.close()

    async def receive(self, text_data):
  
        arr = text_data.split(" ")
        output = ""
        
        command = arr[0]
        args = []
        files = []
        for part in arr[1:]:
            if part.startswith("-") or part.startswith("--"):
                args.append(part)
            else:
                files.append(part)
                
        try:        
            if arr[0]=="cd" and len(arr) > 1:
                os.chdir(arr[1])
                self.cwd = os.getcwd()
                output = os.getcwd()
            elif arr[0]=="location_dir":
                ""
            elif arr[0]=="autocomplete":
                output = self.autocomplete(arr)
            else:
                # command = command.encode()
                # DEVNULL=open(os.devnull, 'wb')
                # output = subprocess.check_output(command, shell=True,  stderr=DEVNULL, stdin=DEVNULL)
                # output = output.decode()
                
                result = subprocess.run(
                    [command, *args, *files],
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    cwd=self.cwd,
                    )
                output = result.stdout + result.stderr
                
        except Exception as error:
            
            output = "Error execute: ${"+ error+ "}\r\n"
        
        loc = self.cwd;      
        loc_list = loc.split('/')        
        loc = loc.replace(loc_list[0]+"/"+loc_list[1]+"/"+loc_list[2], "")
        location_dir =  loc_list[2]+"@" + loc +">> "      
        await self.send(text_data=json.dumps({'exacute': output, 'location_dir': location_dir}))
        
    def autocomplete(self, arr):
        if arr[1] == "cd":
            return self.autocomplete_files(arr[2])      
        elif len(arr) == 2:
            return self.autocomplete_commands(arr[1])
        elif len(arr) > 2:
            return self.autocomplete_files(arr[2])   

    def autocomplete_commands(self, text):
        print(text)
        completions = subprocess.run(['bash', '-c', f'compgen -A command {text}'], capture_output=True, text=True)
        completions = completions.stdout.strip().split("\n")
        return list(set(completions))

    def autocomplete_files(self, path):
        
        completions = []      
        dir = path.split("/")
        directory = self.cwd + "/" + path
        pathFind = dir.pop() 
        
        if not pathFind == "":
            # directory = directory.replace("/"+pathFind,"")
            directory = new.join(directory.rsplit("/"+pathFind, 1))
            
        regex = re.compile(".*" + re.escape(pathFind) + ".*")
        for file in os.listdir(directory):
            if regex.match(file):
                completions.append(file) 
        return completions
