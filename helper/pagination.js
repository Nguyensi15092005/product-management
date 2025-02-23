module.exports = (objectPagenation, query, countPage) => {
    if(query.page){
        objectPagenation.currentPage = parseInt(query.page)
    }

    objectPagenation.skip = (objectPagenation.currentPage - 1)*objectPagenation.limitItems;

    const totalPage = Math.ceil(countPage/objectPagenation.limitItems);
    objectPagenation.totalPage = totalPage;

    return objectPagenation;
    // end pagination page
}