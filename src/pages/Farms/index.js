import React, { useContext, useMemo, useEffect, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { Pair } from '@pancakeswap-libs/sdk'
import { Button, CardBody, Text } from '@pancakeswap-libs/uikit'
import { Link } from 'react-router-dom'
import CardNav from 'components/CardNav'
import Question from 'components/QuestionHelper'
import FullPositionCard from 'components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { StyledInternalLink } from 'components/Shared'
import { LightCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { useAddPopup, useBlockNumber } from '../../state/application/hooks'
import { Contract } from '@ethersproject/contracts'
import { useActiveWeb3React } from 'hooks'
import { usePairs } from 'data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { Dots } from 'components/swap/styleds'
import useI18n from 'hooks/useI18n'
import PageHeader from 'components/PageHeader'
import AppBody from '../AppBody'
import './assets/css/farming_page.css'
import './assets/css/usercss.css'
import icon from './assets/img/icon.png'
import wallet from './assets/img/wallet.png'
import moment from 'moment'
import axios from 'axios'
// import { getContract1 } from '../../../utils/contractHelpers'
import { getContract } from '../../utils'
import { math } from 'polished'
import { compose } from 'redux'
import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export default function Pool() {
  const theme = useContext(ThemeContext)
  const [isApproved, setIsApproved] = useState(false)
  const [days, setDays] = useState(0)
  const [amount, setAmount] = useState('')
  const [indexed, setIndexed] = useState([])
  const [index, setIndex] = useState(0)
  const { library, account } = useActiveWeb3React()
  const [disabled, setDisabled] = useState(false)

  // DepositeToken: "100000000000000000000"
  // WithdrawAbleReward: "0"
  // WithdrawDepositeAmount: "0"
  // WithdrawReward: "0"
  // depositeTime: "0"
  // lastUpdated: "0"
  // lockableDays: "0"
  const [depositeToken, setDepositeToken] = useState(null)
  const [withdrawAbleReward, setWithdrawAbleReward] = useState(null)
  const [WithdrawDepositeAmount, setWithdrawDepositeAmount] = useState(null)
  const [WithdrawReward, setWithdrawReward] = useState(null)
  const [depositeTime, setDepositeTime] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [lockableDays, setLockableDays] = useState(null)
  const [eventsData, setEventsData] = useState([])
  const TranslateString = useI18n()
  const addPopup = useAddPopup()

  useEffect(() => {
    try {
      document.body.classList.remove('body')
    } catch (e) {}
    userHistory()
    getData()
  }, [])
  useEffect(() => {
    getFarmData()
  }, [])
  async function getFarmData() {
    try {
      // const responseAPi = await fetch('https://youthdex.io/api/FarmingApiData')
      axios.get('https://youthdex.io/api/FarmingApiData').then((resp) => {
        console.log('axios response', resp.data)
      })
      // console.log('responseAPi', responseAPi)
    } catch (error) {
      console.log('error', error.message)
    }
  }
  async function getData() {
    try {
      let contractAddress = '0xdA3B393F88B1819e4b367B061Ac243a211869139'
      let contractss = new Contract(contractAddress, abi, library)
      let uRes = await contractss.Users(account)
      console.log('uRes', uRes)

      let res = await contractss.pendindRewards(account)
      // let res1 = await contractss.UserInfomation('0x28ED19deae634D90DD487FaD804276988bF6dBA5')
      let res1 = await contractss.UserInfomation(account)

      let indexes = []

      console.log('res', res1)
      for (let index = 0; index < res1[0].length; index++) {
        const amount = res1[0][index]?._hex
        const day = res1[1][index]?._hex
        const time = res1[2][index]?._hex

        let d = (day * Math.pow(10, 18)) / Math.pow(10, 18)
        let t = (time * Math.pow(10, 18)) / Math.pow(10, 18)

        let res = moment().isAfter(moment(t * 1000).add(d, 'days'))
        if (res) {
          indexes.push(index)
        }
        // console.log('resssss,res', res, index, d, t, moment(t * 1000).add(d, 'days'))
        // indexes.push({ amount, day, time })
      }
      // if (res1[0].index) {
      //   indexes.push(res1[0].index)
      // }
      // // 0x28ED19deae634D90DD487FaD804276988bF6dBA5
      // if (res1[1].index) {
      //   indexes.push(res1[1].index)
      // }

      // if (res1[2].index) {
      //   indexes.push(res1[2].index)
      // }
      console.log('indexes', indexes)
      setIndexed(indexes)
    } catch (error) {
      console.log('error', error)
    }
  }

  async function farm() {
    try {
      if (amount == '') {
        toast.error('Please enter COIN')
      } else if (days == '') {
        toast.error('Please select days')
      } else {
        let isConnected = false
        let contractAddress = '0xdA3B393F88B1819e4b367B061Ac243a211869139'
        // let tokenAddress = '0x85d3446869dAcb8e05c9b4A01A9da799EAF83987'
        let tokenAddress = '0x3b3CD14d6D2fc39A68630582c2EB8ec98C21A81e'
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
          isConnected = true
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
          isConnected = true
        } else {
          isConnected = false
        }
        if (isConnected === true) {
          setDisabled(true)

          const web3 = window.web3
          let accounts = await web3.eth.getAccounts()
          let supplyContract = new web3.eth.Contract(abis, tokenAddress)
          supplyContract.methods
            .approve(contractAddress, web3.utils.toWei(amount))
            .send({
              from: accounts[0],
            })
            .on('transactionHash', async (hash) => {
              console.log(hash)
              setDisabled(true)

              toast.success('Your transaction is pending')
            })
            .on('receipt', async (receipt) => {
              console.log(receipt)
              setIsApproved(true)
              setDisabled(false)
              toast.success('Your transcation is approved')
            })
            .on('error', async (error) => {
              console.log(error.message)
              toast.error(error.message)
              setDisabled(false)

              // setIsApproved(true)
            })
        }
      }
    } catch (error) {
      console.log('error', error)
      toast.error(error.message)
      setDisabled(false)

      // setIsApproved(true)
    }
    // setIsApproved(true)
  }
  async function farmingFunction() {
    try {
      if (amount == '') {
        toast.error('Please enter COIN')
      } else if (days == '') {
        toast.error('Please select days')
      } else {
        let isConnected = false
        let contractAddress = '0xdA3B393F88B1819e4b367B061Ac243a211869139'
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
          isConnected = true
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
          isConnected = true
        } else {
          isConnected = false
        }
        if (isConnected === true) {
          const web3 = window.web3
          let accounts = await web3.eth.getAccounts()
          let supplyContract = new web3.eth.Contract(abi, contractAddress)
          setDisabled(true)

          supplyContract.methods
            .farm(web3.utils.toWei(amount), days)
            .send({
              from: accounts[0],
            })
            .on('transactionHash', async (hash) => {
              console.log(hash)
              setDisabled(true)

              toast.success('Your transaction is pending')
            })
            .on('receipt', async (receipt) => {
              console.log(receipt)
              toast.success('Your transaction is Confirmed')
              setIsApproved(false)
              setDisabled(false)
            })
            .on('error', async (error) => {
              console.log(error.message)
              toast.error(error.message)
              setDisabled(false)
            })
        }
      }
    } catch (error) {
      setDisabled(false)
      toast.error(error.message)

      console.log('error', error)
    }
  }

  async function userHistory() {
    try {
      let isConnected = false
      let contractAddress = '0xdA3B393F88B1819e4b367B061Ac243a211869139'
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
        isConnected = true
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        isConnected = true
      } else {
        isConnected = false
      }
      if (isConnected === true) {
        const web3 = window.web3
        let accounts = await web3.eth.getAccounts()
        let supplyContract = new web3.eth.Contract(abi, contractAddress)
        let uRes = await supplyContract.methods.Users(accounts[0]).call()
        //           DepositeToken: "100000000000000000000"
        // WithdrawAbleReward: "0"
        // WithdrawDepositeAmount: "0"
        // WithdrawReward: "0"
        // depositeTime: "0"
        // lastUpdated: "0"
        // lockableDays: "0"
        let a = await web3.utils.fromWei(uRes?.DepositeToken)
        let b = await web3.utils.fromWei(uRes?.WithdrawAbleReward)
        let c = await web3.utils.fromWei(uRes?.WithdrawDepositeAmount)
        let d = await web3.utils.fromWei(uRes?.WithdrawReward)
        let e = await web3.utils.fromWei(uRes?.depositeTime)
        let f = await web3.utils.fromWei(uRes?.lastUpdated)
        let g = uRes?.lockableDays
        setDepositeToken(a)
        setWithdrawAbleReward(b)
        setWithdrawDepositeAmount(c)
        setWithdrawReward(d)
        setDepositeTime(e)
        setLastUpdated(f)
        setLockableDays(g)
      }
    } catch (error) {
      toast.error(error.message)

      console.log('error', error)
    }
  }
  async function harvestFunction() {
    if (indexed.length > 0) {
      try {
        let isConnected = false
        let contractAddress = '0xdA3B393F88B1819e4b367B061Ac243a211869139'
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
          isConnected = true
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
          isConnected = true
        } else {
          isConnected = false
        }
        if (isConnected === true) {
          const web3 = window.web3
          let supplyContract = new web3.eth.Contract(abi, contractAddress)

          supplyContract.methods
            .harvest([...indexed])
            .send({
              from: account,
            })
            .on('transactionHash', async (hash) => {
              console.log(hash)
              toast.success('Your transaction is Pending')
            })
            .on('receipt', async (receipt) => {
              console.log(receipt)
              toast.success('Your transaction is Confirmed')
            })
            .on('error', async (error) => {
              console.log(error.message)
              toast.error(error.message)
            })
        }
      } catch (error) {
        console.log('error', error)
        toast.error(error.message)
      }
    } else {
      console.log('nothing to harvest')
      toast.error('nothing to harvest')
    }
  }
  async function harvest() {
    try {
      let contractAddress = '0xdA3B393F88B1819e4b367B061Ac243a211869139'
      let contractss = getContract(contractAddress, abi, library, account)
      console.log('contractss.farm', contractss.farm)
      let res = await contractss
        .harvest([index])
        .send({ from: account })
        .on('transactionHash', async (hash) => {
          setIsApproved(true)
          console.log('transactionHash: ', hash)
          addPopup(
            {
              txn: {
                hash: hash,
                success: true,
                summary: 'Transaction hash',
              },
            },
            hash
          )
        })
        .on('error', async (error) => {
          console.log('error: ', error)
        })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function ev() {
    try {
      let isConnected = false
      let contractAddress = '0xdA3B393F88B1819e4b367B061Ac243a211869139'
      // let tokenAddress = '0x85d3446869dAcb8e05c9b4A01A9da799EAF83987'
      let tokenAddress = '0x3b3CD14d6D2fc39A68630582c2EB8ec98C21A81e'
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
        isConnected = true
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        isConnected = true
      } else {
        isConnected = false
      }
      if (isConnected === true) {
        const web3 = window.web3
        let accounts = await web3.eth.getAccounts()
        let supplyContract = new web3.eth.Contract(abi, contractAddress)

        let logs = []
        let blockNumber = await web3.eth.getBlockNumber()

        supplyContract
          .getPastEvents(
            'Deposite_',
            {
              fromBlock: blockNumber - 4900,
              toBlock: blockNumber,
            },
            function (error, events) {
              console.log(events)
            }
          )
          .then(function (events) {
            console.log(events) // same results as the optional callback above
          })

        console.log(blockNumber)

        supplyContract.events
          .Deposite_(
            {
              // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
              fromBlock: blockNumber - 4800,
              // fromBlock: 13499084,
            },
            function (error, event) {
              logs.push(event)
              console.log('logs', logs)
              setEventsData([...logs])
            }
          )
          .on('data', function (event) {
            if (event?.returnValues?.to === '0xb5483f5866A17635D8256d589f0905a54f8eA414') {
              console.log('----------------t----', event)
            } // same results as the optional callback above
            if (event?.returnValues?.From === '0xb5483f5866A17635D8256d589f0905a54f8eA414') {
              console.log('----------------f----', event)
            } // same results as the optional callback above
          })
          .on('changed', function (event) {
            // remove event from local database
          })
          .on('error', console.error)

        console.log('logs', logs)
      }
    } catch (error) {
      console.log('error', error)
      toast.error(error.message)

      // setIsApproved(true)
    }
  }

  useEffect(() => {
    ev()
  }, [])

  function formatAmount(dAmount) {
    let am = 0
    try {
      const web3 = window.web3

      am = web3.utils.fromWei(dAmount).toString()
    } catch (error) {
      console.log('error', error)
    }
    console.log('aa', am)
    return am
  }

  function formatTimes(dTime) {
    try {
      let am = 0
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const dateObj = new Date(dTime * 1000)
      const month = monthNames[dateObj.getMonth()]
      const day = String(dateObj.getDate()).padStart(2, '0')
      const year = dateObj.getFullYear()
      const output = month + '\n' + day + ',' + year

      return month + '\n' + day + ',' + year
    } catch (error) {
      return ''
    }
  }
  return (
    <>
      <ToastContainer />

      <section className="maindsb">
        <div className="maininner  content-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="farming_content">
                  <div className="farm_content">
                    <h1>Farm Anytime, Get Rewards Instantly.</h1>
                    <p className="ule_imgset">It's a good day to farm some CST on BNB.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="farm_serv_box">
                  <div className="farm_icons">
                    <div className="farm_coins">
                      <img src={icon} className="farm_log_set" alt="logo" />
                    </div>
                    <div className="farm_heading">
                      <h2>CST </h2>
                    </div>
                    <div className="farm_capital">
                      <div className="farm_total">
                        <span>Coin</span>
                      </div>
                    </div>
                  </div>

                  <div className=" farm_icons farm_new_item">
                    <div className="farm_heading">
                      <div className="farm_flex_set">
                        <div className="farm_logo ar_drp">
                          <span>CSTswap</span>
                        </div>
                        {/* <!-----ule animation start--> */}
                        <div className="farm_logo farm_logo_group ule_img_height ule_animation"></div>
                        {/* <!-----ule animation end--> */}
                      </div>
                    </div>
                  </div>

                  <div className="farm_bonus">
                    <div className="staking_price">
                      <div className="farm_price d_flex">
                        <span className="hrvst_font" id="pendindmonoRewards">
                          0
                        </span>
                        <button id="btnmonoharvest" onClick={harvestFunction} className="harvest btn button">
                          Harvest
                        </button>
                      </div>
                    </div>

                    <div className="staking_price farming_rewards">
                      <h2>===== MONO Rewards =====</h2>
                      <div className="farm_price d_flex">
                        <span>30 Days : Return % 7% </span>
                        <span className="set_checkbox">
                          <input
                            onChange={() => setDays(30)}
                            type="radio"
                            name="checkbox"
                            className="checkbox"
                            value="30"
                          />
                        </span>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="farm_price d_flex">
                            <span>60 Days : Return % 15% </span>
                            <span className="set_checkbox">
                              <input
                                type="radio"
                                onChange={() => setDays(60)}
                                name="checkbox"
                                className="checkbox"
                                value="60"
                              />
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="farm_price d_flex">
                            <span>90 Days : Return % 20% </span>
                            <span className="set_checkbox">
                              <input
                                type="radio"
                                onChange={() => setDays(90)}
                                name="checkbox"
                                className="checkbox"
                                value="90"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="farm_price d_flex">
                        <span>180 Days : Return % 40%</span>
                        <span className="set_checkbox">
                          <input
                            type="radio"
                            onChange={() => setDays(180)}
                            name="checkbox"
                            className="checkbox"
                            value="180"
                          />
                        </span>
                      </div>
                      <div className="farm_price d_flex">
                        <span>365 Days : Return % 100%</span>
                        <span className="set_checkbox">
                          <input
                            type="radio"
                            onChange={() => setDays(365)}
                            name="checkbox"
                            className="checkbox"
                            value="365"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="farm_usd_set">
                    <p>Get CST - CST</p>
                  </div>
                  <div className="farm_usd_set farm_input">
                    <div className="row">
                      <div className="col-12">
                        <input
                          id="Enter_amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter COIN"
                        />
                      </div>

                      <div className="col-12">
                        <input id="Enter_lockableDays" value={`${days} days`} placeholder="0" disabled />
                      </div>
                    </div>
                  </div>
                  <div className="farm_submit_btn">
                    {isApproved ? (
                      <button
                        type="button"
                        className="btn button btn-primary"
                        disabled={disabled}
                        onClick={farmingFunction}
                        id="btnmono1"
                      >
                        {disabled ? 'Waiting' : 'Farm'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={disabled}
                        className="btn button btn-primary"
                        onClick={farm}
                        id="btnmono1"
                      >
                        {disabled ? 'Waiting' : 'Approve'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {depositeToken && (
              <div className="row">
                <div className="col-12">
                  <h2 className="ule_imgset  pb-3">Farm History</h2>
                </div>
                {/* <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <div className="row" style={{ maxWidth: '400px' }}>
                      <div className="col d-flex justify-content-start" style={{ minWidth: '200px' }}>
                        <p className="ule_imgset">Deposite Token</p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <p className="ule_imgset"> {depositeToken} </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex  py-2 justify-content-center">
                    <div className="row" style={{ maxWidth: '400px' }}>
                      <div className="col p-0 d-flex justify-content-start" style={{ minWidth: '200px' }}>
                        <p className="ule_imgset">Withdrawable Reward</p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <p className="ule_imgset"> {withdrawAbleReward} </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <div className="row" style={{ maxWidth: '400px' }}>
                      <div className="col p-0 d-flex justify-content-start" style={{ minWidth: '200px' }}>
                        <p className="ule_imgset">Withdraw Deposite Amount </p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <p className="ule_imgset"> {WithdrawDepositeAmount} </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex  py-2 justify-content-center">
                    <div className="row" style={{ maxWidth: '400px' }}>
                      <div className="col p-0 d-flex justify-content-start" style={{ minWidth: '200px' }}>
                        <p className="ule_imgset">Withdraw Reward </p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <p className="ule_imgset"> {WithdrawReward} </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <div className="row" style={{ maxWidth: '400px' }}>
                      <div className="col p-0  d-flex justify-content-start" style={{ minWidth: '200px' }}>
                        <p className="ule_imgset">Lockable Days </p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <p className="ule_imgset"> {lockableDays} </p>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <div className="row">
                      <table>
                        <tr>
                          <th>
                            <p className="ule_imgset px-2 pt-2">{'Block Number'}</p>
                          </th>
                          <th>
                            <p className="ule_imgset px-2 pt-2">{'Day'}</p>
                          </th>
                          <th>
                            <p className="ule_imgset px-2 pt-2">{'Time'}</p>
                          </th>
                          <th>
                            <p className="ule_imgset px-2 pt-2">{'Amount'}</p>
                          </th>
                          <th>
                            <p className="ule_imgset px-2 pt-2">{'Transaction Hash'}</p>
                          </th>
                          <th>
                            <p className="ule_imgset px-2 pt-2">{'farm'}</p>
                          </th>
                        </tr>
                        {eventsData.map((item, index) => {
                          return (
                            <tr>
                              <td>
                                <p className="ule_imgset px-2 pt-2">{item?.blockNumber}</p>
                              </td>
                              <td>
                                <p className="ule_imgset px-2 pt-2">{item?.returnValues?.day}</p>
                              </td>
                              <td>
                                <p className="ule_imgset px-2 pt-2">{formatTimes(item?.returnValues?.time)}</p>
                              </td>
                              <td>
                                <p className="ule_imgset px-2 pt-2">{formatAmount(item?.returnValues?.amount)}</p>
                              </td>
                              <td>
                                <a
                                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                  href={`https://bscscan.com/tx/${item?.transactionHash}`}
                                >
                                  <p
                                    className="ule_imgset px-2 pt-2"
                                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                  >
                                    {`${item?.transactionHash?.slice(0, 7)} ... ${item?.transactionHash?.slice(
                                      item?.transactionHash?.length - 7,
                                      item?.transactionHash?.length
                                    )}`}
                                  </p>
                                </a>
                              </td>
                            </tr>
                          )
                        })}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {
              <div className="row">
                <div className="col-12">
                  <h2 className="ule_imgset farmHistory pb-3">Farm History</h2>
                </div>
                {/* <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <div className="row" style={{ maxWidth: '400px' }}>
                      <div className="col d-flex justify-content-start" style={{ minWidth: '200px' }}>
                        <p className="ule_imgset">Deposite Token</p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <p className="ule_imgset"> {depositeToken} </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex  py-2 justify-content-center">
                    <div className="row" style={{ maxWidth: '400px' }}>
                      <div className="col p-0 d-flex justify-content-start" style={{ minWidth: '200px' }}>
                        <p className="ule_imgset">Withdrawable Reward</p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <p className="ule_imgset"> {withdrawAbleReward} </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <div className="row" style={{ maxWidth: '400px' }}>
                      <div className="col p-0 d-flex justify-content-start" style={{ minWidth: '200px' }}>
                        <p className="ule_imgset">Withdraw Deposite Amount </p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <p className="ule_imgset"> {WithdrawDepositeAmount} </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex  py-2 justify-content-center">
                    <div className="row" style={{ maxWidth: '400px' }}>
                      <div className="col p-0 d-flex justify-content-start" style={{ minWidth: '200px' }}>
                        <p className="ule_imgset">Withdraw Reward </p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <p className="ule_imgset"> {WithdrawReward} </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <div className="row" style={{ maxWidth: '400px' }}>
                      <div className="col p-0  d-flex justify-content-start" style={{ minWidth: '200px' }}>
                        <p className="ule_imgset">Lockable Days </p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <p className="ule_imgset"> {lockableDays} </p>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="row ">
                  <div className="col-12 d-flex justify-content-center">
                    <div className="row tableWalletAddress">
                      <table>
                        <tr>
                          <th>
                            <p className="ule_imgset farmStyle farmHeadings px-2 pt-2">{'Wallet Address'}</p>
                          </th>
                          <th>
                            <p className="ule_imgset farmStyle farmHeadings px-2 pt-2">{'Amount'}</p>
                          </th>
                          <th>
                            <p className="ule_imgset farmStyle farmHeadings px-2 pt-2">{'Day'}</p>
                          </th>
                          <th>
                            <p className="ule_imgset farmStyle farmHeadings px-2 pt-2">{'Txn'}</p>
                          </th>

                          <th>
                            <p className="ule_imgset farmStyle farmHeadings px-2 pt-2">{'Time Span'}</p>
                          </th>
                        </tr>
                        {farmData.map((item, index) => {
                          return (
                            <tr>
                              <th>
                                <p className="ule_imgset farmStyle px-2 pt-2">
                                  {item?.WalletAddress?.slice(0, 5)}
                                  {'...'}
                                  {item?.WalletAddress.slice(
                                    item?.WalletAddress.length - 5,
                                    item?.WalletAddress.length
                                  )}
                                </p>
                              </th>
                              <th>
                                <p className="ule_imgset farmStyle px-2 pt-2">{item?.Amount}</p>
                              </th>
                              <th>
                                <p className="ule_imgset farmStyle px-2 pt-2">{item?.Days}</p>
                              </th>
                              <th>
                                <p className="ule_imgset farmStyle px-2 pt-2">
                                  {item?.Txn?.slice(0, 5)}
                                  {'...'}
                                  {item?.Txn.slice(item?.Txn.length - 5, item?.Txn.length)}
                                </p>
                              </th>
                              <th>
                                <p className="ule_imgset farmStyle px-2 pt-2">{item?.Time_Span}</p>
                              </th>
                            </tr>
                          )
                        })}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </>
  )
}

const abis = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_amount', type: 'uint256' }],
    name: 'withDraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'erc20token',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: 'value', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_address', type: 'address' }],
    name: 'register',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_contributors', type: 'address[]' },
      { name: '_balances', type: 'uint256[]' },
    ],
    name: 'sendMultiBnb',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'buy',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_contributors', type: 'address[]' },
      { name: '_balances', type: 'uint256[]' },
    ],
    name: 'multisendToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_amount', type: 'uint256' }],
    name: 'getTokens',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_token', type: 'uint256' }],
    name: 'sell',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'total', type: 'uint256' },
      { indexed: false, name: 'tokenAddress', type: 'address' },
    ],
    name: 'Multisended',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'previousOwner', type: 'address' },
      { indexed: false, name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
]

let abi = [
  {
    inputs: [{ internalType: 'contract ITRC20', name: '_token', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: true, internalType: 'address', name: 'From', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'day', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'time', type: 'uint256' },
    ],
    name: 'Deposite_',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    constant: true,
    inputs: [],
    name: 'Token',
    outputs: [{ internalType: 'contract ITRC20', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '_add', type: 'address' }],
    name: 'UserInfomation',
    outputs: [
      { internalType: 'uint256[]', name: '', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '', type: 'uint256[]' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'Users',
    outputs: [
      { internalType: 'uint256', name: 'DepositeToken', type: 'uint256' },
      { internalType: 'uint256', name: 'lastUpdated', type: 'uint256' },
      { internalType: 'uint256', name: 'lockableDays', type: 'uint256' },
      { internalType: 'uint256', name: 'WithdrawReward', type: 'uint256' },
      { internalType: 'uint256', name: 'WithdrawAbleReward', type: 'uint256' },
      { internalType: 'uint256', name: 'depositeTime', type: 'uint256' },
      { internalType: 'uint256', name: 'WithdrawDepositeAmount', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: '_owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'allocation',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'depositeToken',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'depositetime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: 'WORTHWHILEAmount', type: 'uint256' }],
    name: 'emergencyWithdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: 'Amount', type: 'uint256' }],
    name: 'emergencyWithdrawBNB',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_lockableDays', type: 'uint256' },
    ],
    name: 'farm',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256[]', name: '_index', type: 'uint256[]' }],
    name: 'harvest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'lockabledays',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '_add', type: 'address' }],
    name: 'pendindRewards',
    outputs: [{ internalType: 'uint256', name: 'reward', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
let farmData = [
  {
    WalletAddress: '0xdA3B393F88B1819e4b367B061Ac243a211869139',
    Amount: '1000',
    Days: '30',
    Txn: '0xa80ecab470afe84c365f75cd87f2934557ac78542a1f99b4b3c0c4734b3a262d',
    Time_Span: '1639586328',
  },
  {
    WalletAddress: '0xdA3B393F88B1819e4b367B061Ac243a211869139',
    Amount: '1000',
    Days: '30',
    Txn: '0xa80ecab470afe84c365f75cd87f2934557ac78542a1f99b4b3c0c4734b3a262d',
    Time_Span: '1639586328',
  },
  {
    WalletAddress: '0xdA3B393F88B1819e4b367B061Ac243a211869139',
    Amount: '1000',
    Days: '30',
    Txn: '0xa80ecab470afe84c365f75cd87f2934557ac78542a1f99b4b3c0c4734b3a262d',
    Time_Span: '1639586328',
  },
]
