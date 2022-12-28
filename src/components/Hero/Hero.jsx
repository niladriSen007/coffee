import React, { useEffect, useState } from "react";
import "./Hero.css";
import abi from "../../contracts/BuyMeACoffe.json";
import { ethers } from "ethers";
const Hero = () => {
  const [formData, setFormData] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [acc, setAcc] = useState("None");

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x9639C22729C9eEd6b7fE242DBbD0048BFeAEAc4d";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;
        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("chainChanged",()=>{
            window.location.reload();
          })

           window.ethereum.on("accountsChanged",()=>{
            window.location.reload();
          })

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setAcc(account);
          setFormData({ provider, signer, contract });
        } else {
          alert("Please Install Metamask");
        }
      } catch (e) {
        console.log(e);
      }
    };

    connectWallet();
  }, []);


  const [data,setData] = useState({
    name:"",
    message:""
  })


  const handleChange = (e) => {
    e.preventDefault();
    setData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  }; 

  const [followers,setFollowers] = useState([])

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(data);
    setData({
      name: "",
      message: "",
    });
    const {contract} = formData;
    const amount = {value:ethers.utils.parseEther(".001")};
  const transaction = await contract.buyCoffee(data.name,data.message,amount);
  await transaction.wait()
  console.log("Transaction done")
  const memos = await formData.contract.getMemos();
  setFollowers(memos)
  console.log(memos)
  };

  console.log(formData);
  return (
    <div className="hero">
      <p className="owner">
        Owner : {acc ? formData.contract?.address : "None"}
      </p>
      <div className="desc">
        <h1 className="main-heading">roasted coffee for you</h1>
        <p className="sub-heading">
          The coffee is brewed by first roasting the green coffee beans over hot
          coals in a brazier. given an opportunity to sample.
        </p>
        <a href="#form-container" ><button className="button-show">Buy Me A Coffee</button></a>
      </div>
      <div className="products">
        <img
          src="https://xpressrow.com/wp/cafena/wp-content/uploads/2022/04/about-bg-3-1.jpeg"
          alt=""
        />
        <div className="about">
          <span className="banner">OUR HISTORY</span>
          <h2 className="about-main">CREATE A NEW STORY WITH US</h2>
          <p className="about-desc">
            Mauris rhoncus orci in imperdiet placerat. Vestibulum euismod nisl
            suscipit ligula volutpat, a feugiat urna maximus. Cras massa
            nibhtincidunt.
          </p>
          <p className="about-desc">
            Donec et nibh maximus, congue est eu, mattis nunc. Praesent ut quam
            quis quam venenatis fringilla. Morbi vestibulum id tellus mmodo
            mattis. Aliquam erat volutpat.
          </p>
        </div>
      </div>
      <div className="fom-container" id="form-container">
        
        <form onSubmit={(e)=>handleSubmit(e)} className="form">
        <p className="form-heading">Enter your name and message</p>
          <input type="text" onChange={(e)=>handleChange(e)} value={data.name} name="name"  placeholder="Enter Your Name" />
          <input type="text" onChange={(e)=>handleChange(e)} value={data.message} name="message" placeholder="Enter Your Message" />
          <button type="submit" className="button-show" onChange={(e)=>handleChange(e)}>Buy Me A Coffee</button>
        </form>
       <div className="map">
       <iframe
        title="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.851199305698!2d88.44321601491318!3d22.6965825851191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89f2f4d8192db%3A0x8b53463b0e497142!2sSreepur%2C%20Madhyamgram%2C%20West%20Bengal%20700130!5e0!3m2!1sen!2sin!4v1672233648723!5m2!1sen!2sin"
          width="700"
          height="450"
          style={{border:"0"}}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
       </div>
      </div>
      <div className="followers">
        <h2 className="followers-list-heading">Followers List</h2>
        <div className="list-heading">
          <p   style={{flex:"1.2"}}>Address</p>
          <p   style={{flex:".95"}}>Name</p>
          <p   style={{flex:"1.2"}}>Message</p>
          <p   style={{flex:".6"}}>Time</p>
        </div>
        {
          followers.map(follower=>(
            <div className="follower-name-list" key={follower.timestamp}>
              <p   style={{flex:"1"}}>{follower.from}</p>
              <p  style={{flex:".8"}}>{follower.name}</p>
              <p  style={{flex:"1"}}>{follower.message}</p>
              <p  style={{flex:".8"}}>{new Date(follower.timestamp * 1000 ).toLocaleString()}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Hero;
