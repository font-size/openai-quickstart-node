import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

let beforeMessage = '';
let messagesEnd;
let disabled = false;
// let messageList = [];

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  // 用于操作聊天列表元素的引用

  let [messageList] = useState([]);

  // 监听聊天数据的变化，改变聊天容器元素的 scrollTop 值让页面滚到最底部


  function scrollToBottom() {
    if (messagesEnd) {
      const scrollHeight = messagesEnd.scrollHeight;//里面div的实际高度  2000px
      const height = messagesEnd.clientHeight; //网页可见高度  200px
      const maxScrollTop = scrollHeight - height;
      messagesEnd.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      //如果实际高度大于可见高度，说明是有滚动条的，则直接把网页被卷去的高度设置为两个div的高度差，实际效果就是滚动到底部了。
    }
  }

  async function onSubmit(event) {
    if (disabled){
      return;
    }
    disabled = true;
    messageList.push(animalInput);
    setTimeout(()=> {
      scrollToBottom();
    }, 100)
    event.preventDefault();
    try {
      const response = await fetch("/ai/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: animalInput, beforeMessage }),
      });
     
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
     
      beforeMessage = `${beforeMessage}
      Human: ${animalInput}
      AI: ${data.result}
      `
      
      messageList.push(data.result);
      setTimeout(()=> {
        scrollToBottom();
      }, 100)
      console.log('messageList: ', messageList);
      
      setAnimalInput("");
      disabled = false;
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      disabled = false;
    }
  }

  const qa = messageList.map((item, index) => {
    console.log('index: ', index);
      let line_style = '';
      if (index % 2 !== 0) {
        line_style = 'ai';
        return  <div className={styles.ai}><img src="/ai/dog.png" className={styles.icon} /> <div className={styles.result}  key={index}>{item}</div></div>   
      } else {
        line_style = 'human';
        return  <div className={styles.human}><div className={styles.result}  key={index}>{item}</div><img src="/ai/me.jpg" className={styles.icon} /> </div>   
      }
      
  })

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/ai/dog.png" />
      </Head>

      <main className={styles.main}>
       
        <p>我是来自OpenAI的ChatGPT机器人，我会知无不言</p>
       
        <div className={styles.qa}  ref={(el) => { messagesEnd = el; }}>
          {qa}
        </div>
        {/* <div className={styles.result}>{result}</div> */}
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            rows="5"
            name="animal"
            placeholder="Enter words"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="发 送" />
        </form>
       
      </main>
    </div>
  );
}
