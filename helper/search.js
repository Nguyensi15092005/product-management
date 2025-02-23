module.exports = (query) =>{
    const objectSearch = {
        keyword: "",
        regex: ""
    }

    if(query.keyword){
        objectSearch.keyword = query.keyword;

        // lấy ở trang Regular js  để có thể timg kiếm vd như iphone 15 tìm iphone nó cx ra
        // còn "i" là để có thể hiểu đc viết hoa và viếc thường
        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }
    return objectSearch;
}