const { json } = require("express/lib/response");

class Apifeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
   

    // over ride the query with ...keyword to fetch value from regex above
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    // remove some field for category
    const removeFiled = ["keyword", "page", "limit"];
    removeFiled.forEach((key) => delete queryCopy[key]);
    //  console.log(queryCopy);
    //Filter for price and rating in site
    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`)


    this.query = this.query.find(JSON.parse(queryString));
    // console.log(queryString);
    return this;
  }

  //pagination of product per page
  pagination(resultpage){
    const currentpage = Number(this.queryStr.page)|| 1;
     const skip = resultpage * (currentpage - 1);
     this.query= this.query.limit(resultpage).skip(skip);
     return this;
  }
}
module.exports = Apifeatures;
