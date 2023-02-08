import { useEffect, useState } from "react";

export interface Data {
  question: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  answer_e: string;
  answer_true: string;
}

const websocket = new WebSocket("ws://192.168.17.131:8000/ws/testing/");

const Testing = () => {
  const [search, setSearch] = useState("");
  //   const [dropdown, setDropdown] = useState(false);
  const [data, setData] = useState<Data[]>([]);

  const clickHandler = (username: string) => {
    // setDropdown(false);
  };

  const searchHandler = (text: any) => {
    setSearch(text);
    console.log(text);
    // websocket.send(text);
  };

  const submmitHandler = () => {
    websocket.send(search);
  };

  useEffect(() => {
    websocket.onopen = function (evt) {
      console.log(evt);
    };

    websocket.onclose = function (evt) {
      console.log("onclose");
    };
    websocket.onmessage = async function (evt) {
      //   JSON.parse(evt.data);
      setData(JSON.parse(evt.data));

      console.log(JSON.parse(evt.data));
      if (data.length > 0) {
      }
    };
    websocket.onerror = function (evt) {
      console.log(evt);
    };
  }, []);

  return (
    <div className="pt-10 mx-auto h-full w-full">
      <div className="flex justify-center">
        <button
          className="w-20 rounded-md px-2 mr-2 h-[42px] bg-slate-200"
          onClick={submmitHandler}
        >
          Find ..
        </button>
        <input
          type="text"
          className="border py-2 px-4 w-full h-[42px] mb-2"
          placeholder="Ввести текст ..."
          value={search}
          onChange={(e) => searchHandler(e.target.value)}
        />
      </div>

      <ul className="mx-4" key={"item"}>
        {data &&
          data.map((item, index) => (
            <li
              key={index}
              onClick={() => clickHandler(item.question)}
              className=""
            >
              {item.question}
              <p className="p-1">{item.answer_a}</p>
              <p className="p-1">{item.answer_b}</p>
              <p className="p-1">{item.answer_c}</p>
              <p className="p-1">{item.answer_d}</p>
              <p className="p-1">{item.answer_e}</p>

              <p className="bg-green-100">{item.answer_true}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Testing;
