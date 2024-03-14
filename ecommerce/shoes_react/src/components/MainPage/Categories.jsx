import React from "react"

const Categories = () => {
  const data = [
    {
      cateImg: "./images/category/cat1.png",
      cateName: "Tops",
    },
    {
      cateImg: "./images/category/cat2.png",
      cateName: "Bottoms",
    },
    {
      cateImg: "./images/category/cat3.png",
      cateName: "Dresses",
    },
    {
      cateImg: "./images/category/cat4.png",
      cateName: "Outerwear",
    },
    {
      cateImg: "./images/category/cat5.png",
      cateName: "Activewear",
    },
    {
      cateImg: "./images/category/cat6.png",
      cateName: "Swimwear",
    },
    {
      cateImg: "./images/category/cat7.png",
      cateName: "Intimates",
    },
    {
      cateImg: "./images/category/cat8.png",
      cateName: "Accessories",
    },
    {
      cateImg: "./images/category/cat9.png",
      cateName: "Baby Toys",
    },
    {
      cateImg: "./images/category/cat10.png",
      cateName: "Footwear",
    },
    {
      cateImg: "./images/category/cat11.png",
      cateName: "Plus Size",
    },
  ]

  return (
    <>
      <div className='category'>
        {data.map((value, index) => {
          return (
            <div className='box f_flex' key={index}>
              <img src={value.cateImg} alt='' />
              <span>{value.cateName}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Categories
