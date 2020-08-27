class APIFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const queryObj = { ...this.queryObject };
    const excludeFields = ['sort', 'page', 'limit', 'fields'];

    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryObject.page * 1 || 1;
    const limit = this.queryObject.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

// console.log(req.query);
// const queryObj = { ...req.query };
// const excludeFields = ['sort', 'page', 'limit', 'fields'];

// excludeFields.forEach((el) => delete queryObj[el]);

// // 1B) Advanced filtering
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

// let query = Tour.find(JSON.parse(queryStr));
// 2) Sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }
// 3) Fields
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }
// 4) Pagination
// console.log(req.query);
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('Page is not valid');
// }
