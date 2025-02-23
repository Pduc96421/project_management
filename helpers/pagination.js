module.exports = (objectPageination, query, countProducts) => {
    if(query.page){
        objectPageination.currentPage = parseInt(query.page);
    }

    objectPageination.skip = (objectPageination.currentPage - 1) * objectPageination.limitItem;
    
    const totalPage = Math.ceil(countProducts / objectPageination.limitItem);
    objectPageination.totalPage = totalPage;

    return objectPageination;
}