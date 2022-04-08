import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const StyledNav = styled.div`
  margin-bottom: 15px;
  background: #690a74;
  padding: 10px 20px;
  border-radius: 10px;
`
function Nav({ activeIndex = 0 }: { activeIndex?: number }) {
  const TranslateString = useI18n()
  return (
    <StyledNav>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="primary">
        <ButtonMenuItem
          id="swap-nav-link"
          to="/swap"
          as={Link}
          className={activeIndex == 0 ? 'btnSwap' : 'btnSwapNonActive'}
        >
          {TranslateString(1142, 'Swap')}
        </ButtonMenuItem>
        <ButtonMenuItem
          id="pool-nav-link"
          to="/pool"
          as={Link}
          className={activeIndex != 0 ? 'btnLiquidity' : 'btnLiquidityNonActive'}
        >
          {TranslateString(262, 'Liquidity')}
        </ButtonMenuItem>
        {/* <ButtonMenuItem
          id="pool-nav-link"
          as="a"
          href="https://www.binance.org/en/bridge?utm_source=PancakeSwap"
          target="_blank"
          rel="noreferrer noopener"
        >
          Bridge
        </ButtonMenuItem> */}
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav
