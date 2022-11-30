import * as React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
// import { Link } from 'wouter'

const Page = styled.div`
  position: fixed;
  left: 200px;
  width: calc(100% - 200px);
  height: 100vh;
  overflow-y: hidden;

  & > h1 {
    font-family: 'Roboto', sans-serif;
    font-weight: 900;
    font-size: 8em;
    margin: 0;
    color: black;
    line-height: 0.59em;
    letter-spacing: -2px;
  }

  & > h1 {
    position: absolute;
    top: 70px;
    left: 60px;
  }

  & > span {
   
  }

  @media only screen and (max-width: 1000px) {
    & > h1 {
      font-size: 5em;
      letter-spacing: -1px;
    }
  }

  & > a {
    margin: 0;
    color: black;
    text-decoration: none;
  }
`

export const Title = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgb(253, 159, 233);
  padding: 10px 10px;
  border-radius: 8px;
  color: #333;
  font-weight: 600;
  font-size: 15px;
`;

const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow: hidden;
  }

  #root {
    overflow: auto;
  }

  body {
    position: fixed;
    overflow: hidden;
    overscroll-behavior-y: none;
    font-family: 'Inter', sans-serif;
    color: black;
    background: #fff !important;
  }

  canvas {
    touch-action: none;
  }

  .container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .text {
    line-height: 1em;
    text-align: left;
    font-size: 8em;
    word-break: break-word;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`
export const DemoPanel = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: 200px;
  padding: 6px 6px;
  box-sizing: border-box;
  background: #171717;
  overflow-y: auto;
`

export const Dot = styled.span`
  display: block;
  width: 100%;
  padding: 8px 8px;
  border-radius: 8px;
  margin-bottom: 2px;
  text-decoration: none;
  color: #bfb6bf;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
`

export const DotContent = styled.span`
  margin-left: 8px;
`

const LoadingContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #dedddf;
  color: black;
`

const LoadingMessage = styled.div`
  font-family: 'Inter', Helvetica, sans-serif;
`

export const Loading = () => {
  return (
    <LoadingContainer>
      <LoadingMessage>Loading.</LoadingMessage>
    </LoadingContainer>
  )
}

const StyledError = styled.div`
  position: absolute;
  padding: 10px 20px;
  bottom: unset;
  right: unset;
  top: 60px;
  left: 60px;
  max-width: 380px;
  border: 2px solid #ff5050;
  color: #ff5050;
`

export const Error = ({ children }: React.PropsWithChildren<{}>) => {
  return <StyledError>{children}</StyledError>
}

export { Global, Page }
