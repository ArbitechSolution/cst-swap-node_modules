import React, { useContext } from 'react'
import { Menu as UikitMenu } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { allLanguages } from 'constants/localisation/languageCodes'
import { LanguageContext } from 'hooks/LanguageContext'
import useTheme from 'hooks/useTheme'
import useGetPriceData from 'hooks/useGetPriceData'
import useGetLocalProfile from 'hooks/useGetLocalProfile'
import useAuth from 'hooks/useAuth'
import links from './config'
import { CAKE } from '../../constants'
import { HashRouter, useLocation, Switch } from 'react-router-dom'

const Menu: React.FC = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const priceData = useGetPriceData()
  const cakePriceUsd = 0
  //   priceData ? Number(
  //   priceData?.data[CAKE?.address]?.price ?? 0
  // ) : undefined
  const profile = useGetLocalProfile()
  const loc = useLocation()
  console.log('loc in menu', loc)
  const getUrl = () => {
    if (loc?.pathname?.includes('/swap')|| loc?.pathname?.includes('/find')|| 
    loc?.pathname?.includes('/pool')||
    loc?.pathname?.includes('/add')||
    loc?.pathname?.includes('/farms')||
    loc?.pathname?.includes('/remove')) {
      return false;
    }else{
      return true;
    }
  }
  return (
    <>
      {getUrl()? (
        <>{props?.children}</>
      ) : (
        <UikitMenu
          links={links}
          account={account as string}
          login={login}
          logout={logout}
          isDark={isDark}
          toggleTheme={toggleTheme}
          currentLang={selectedLanguage?.code || ''}
          langs={allLanguages}
          setLang={setSelectedLanguage}
          cakePriceUsd={cakePriceUsd}
          profile={profile}
          {...props}
        />
      )}
    </>
  )
}

export default Menu
