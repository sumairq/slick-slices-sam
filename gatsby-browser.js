import React from 'react'
import Layout from './src/components/Layout'
import {OrderProvider} from './src/components/OrderContext'

export function wrapPageElement({props,element}){
    return (<Layout {...props}>{element}</Layout>)
}


export function wrapRootElement({element}){
return <OrderProvider>{element}</OrderProvider>
}