/* eslint-disable no-unused-vars */

import './App.css';
import React from 'react';
import {Login,Signup,Home, CreateProduct,OrderConfirmation,SelectAddress,MyOrdersPage, MyProducts, Cart, ProductDetails, Profile, CreateAddress} from "./Routes/Routes"
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/create-product' element={<CreateProduct/>}/>  
    {/* For edit product by id */}
    <Route path="/create-product/:id" element={<CreateProduct />} />
    <Route path="/my-products" element={<MyProducts/>} />
    <Route path="/cart" element={<Cart/>} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/profile" element={<Profile />} />
    <Route path='/create-address' element={<CreateAddress />} />
    <Route path="/select-address" element={<SelectAddress />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/myorders" element={<MyOrdersPage/>}/>

    </Routes>
    </BrowserRouter>
  );
}

export default App;
