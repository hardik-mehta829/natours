class apifeatures {
  constructor(query, querystring) {
    this.query = query;
    this.querystring = querystring;
  }
  filter() {
    const queryobj = { ...this.querystring };
    const excludedfields = ['sort', 'limit', 'page', 'fields'];
    excludedfields.forEach((el) => delete queryobj[el]);

    let querystr = JSON.stringify(queryobj);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(querystr));
    this.query = this.query.find(JSON.parse(querystr));
    return this;
    // let query = Tour.find(JSON.parse(querystr));
  }
  sort() {
    if (this.querystring.sort) {
      console.log(this.querystring.sort);
      const sortby = this.querystring.sort.split(',').join(' ');

      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort('-createdat');
    }
    return this;
  }
  limitfields() {
    if (this.querystring.fields) {
      const fields = this.querystring.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // query = query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = this.querystring.page * 1 || 1;
    const limit = this.querystring.limit * 1 || 100;
    const skip = (page - 1) * limit;
    console.log(skip);
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = apifeatures;
