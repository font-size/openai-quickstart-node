import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

let beforeMessage = '';
let messagesEnd;
let disabled = false;
// let messageList = [];

export default function Home() {
  const [messageInput, setmessageInput] = useState("");
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

  function onClear() {
    window.location.href = '/ai';
  }

  async function onSubmit(event) {
    if (disabled){
      event.preventDefault();
      return;
    }
    disabled = true;
    messageList.push(messageInput);
    setmessageInput("");

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
        body: JSON.stringify({ question: messageInput, beforeMessage }),
      });
     
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
     
      beforeMessage = `${beforeMessage}
      Human: ${messageInput}
      AI: ${data.result}
      `
      
      messageList.push(data.result);
      setTimeout(()=> {
        scrollToBottom();
      }, 100)
      // console.log('messageList: ', messageList);
      
      setmessageInput("");
      disabled = false;
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      disabled = false;
    }
  }

  const qa = messageList.map((item, index) => {
      if (index % 2 !== 0) {
        return  <div className={styles.ai}  key={index}><img src="/ai/dog.png" className={styles.icon} /> <div className={styles.result} >{item}</div></div>   
      } else {
        return  <div className={styles.human}  key={index}><div className={styles.result}  >{item}</div><img src="/ai/me.jpg" className={styles.icon} /> </div>   
      }
      
  })

  return (
    <div>
      <Head>
        <title>AI聊天室</title>
        <link rel="icon" href="/ai/dog.png" />
      </Head>

      <main className={styles.main}>
       
        <div className={styles.qa}  ref={(el) => { messagesEnd = el; }}>
          <div className={styles.ai}><img src="/ai/dog.png" className={styles.icon} /> <div className={styles.result} >你好，我是ChatGPT机器人</div></div>   
          {qa}
        </div>
        <div className={styles.clearBox}>
          <span className={styles.clear} onClick={onClear}>清空当前聊天</span>
        </div>
        <form onSubmit={onSubmit}>
       
          <textarea
            type="text"
            rows="3"
            name="question"
            placeholder="你想说什么？"
            value={messageInput}
            onChange={(e) => setmessageInput(e.target.value)}
          />
          <input type="submit" value="发 送" />
        </form>
       
      </main>
    </div>
  );
}
