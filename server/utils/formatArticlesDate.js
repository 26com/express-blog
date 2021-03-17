const formatArticlesDate = (articles) => {
    console.log("FORMAT");
    articles.forEach(article => {
        const nowDate = article.dataValues.createdat.getDate();
        const nowMonth = Number(article.dataValues.createdat.getMonth()) + 1;
        const nowYear = article.dataValues.createdat.getFullYear();
        article.dataValues.date = nowDate + '/' + nowMonth + '/' + nowYear;
    });
    return articles;
};

module.exports = {
    formatArticlesDate
};