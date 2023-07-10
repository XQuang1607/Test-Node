const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../utils');
const {
    q1,
    q3a,
} = require('./validation');
const {
    question1,
    question1a,
    question1b,
    question2a,
    question2b,
    question3,
    question3a,
    question3b,
    question3c,
    question4,
    question4a,
    question5,
    question6,
    question7,
    question7a,
    question8a,
    question8b,
    question9,
    question10,
    question11,
    question12,
    question13,
    question14,
    question15,
    question16,
    question16a,
    question17,
    question18,
    question19,
    question20,
    question21,
    question22,
    question23,
    question24,
    question25,
    question26,
    question26b,
    question27,
    question28,
    question29,
    question30,
    question31,
    question32,
    question33,
    question34,
    hotsale,
    flashsale,
    categorylimit
} = require('./controller');

router.get('/1', question1);
router.get('/1a', validateSchema(q1), question1a);
router.get('/1b', question1b);
router.get('/2a', question2a);
router.get('/2b', question2b);
router.get('/3', question3);
router.get('/3a', validateSchema(q3a), question3a);
router.get('/3b', question3b);
router.get('/3c', question3c);
router.get('/4', question4);
router.get('/4a', question4a);
router.get('/5', question5);
router.get('/6', question6);
router.get('/7', question7);
router.get('/7a', question7a);
router.get('/8a', question8a);
router.get('/8b', question8b);
router.get('/9', question9);
router.get('/10', question10);
router.get('/11', question11);
router.get('/12', question12);
router.get('/13', question13);
router.get('/14', question14);
router.get('/15', question15);
router.get('/16', question16);
router.get('/16a', question16a);
router.get('/17', question17);
router.get('/18', question18);
router.get('/19', question19);
router.get('/20', question20);
router.get('/21', question21);
router.get('/22', question22);
router.get('/23', question23);
router.get('/24', question24);
router.get('/25', question25);
router.get('/26', question26);
router.get('/26b', question26b);
router.get('/27', question27);
router.get('/28', question28);
router.get('/29', question29);
router.get('/30', question30);
router.get('/31', question31);
router.get('/32', question32);
router.get('/33', question33);
router.get('/34', question34);
router.get('/hotsale', hotsale);
router.get('/flashsale', flashsale);
router.get('/categorylimit', categorylimit);


module.exports = router;