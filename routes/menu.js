const express = require('express');
const fs = require('fs');

const router = express.Router();

const menuJSON = JSON.parse(fs.readFileSync('./config/configFiles/menu.json', 'utf8'));

/**
 * Function returns menu structore of the application
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[Function]}    Carry on with the route path
 */
router.get('/', function (req, res, next) {
    res.status(200).json(menuJSON);
})
module.exports = router;