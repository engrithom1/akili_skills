const express = require('express')
const router = express.Router()
const mainController = require('../controllers/mainController')
const authController = require('../controllers/authController')
const videoController = require('../controllers/videoController')
const audioController = require('../controllers/audioController')
const bookController = require('../controllers/bookController')
const feedController = require('../controllers/feedController')
const qnaController = require('../controllers/qnaController')
const paymentController = require('../controllers/paymentController')
const commentController = require('../controllers/commentController')
const discussionController = require('../controllers/discussionController')
const checker = require('../middleware/authMiddleware')


///payment controller
router.get('/payment',checker.authChecker,paymentController.payment)
router.post('/payment',paymentController.makePayment)
router.post('/cancel',paymentController.cancelPayment)
router.post('/success',paymentController.successPayment)

///qna functions
router.get('/qna/:slug', qnaController.singleQna)
router.post('/add-question', qnaController.createQna)
router.get('/account/qna',checker.authChecker, qnaController.accountQna)
router.get('/account/qna-edit/:id', qnaController.getQnaEdit)
router.post('/account/qna-edit/:id', qnaController.updateQna)

////////comments functions
router.post('/add-comment', commentController.allInOneComment)
router.post('/add-reply', commentController.discussionReply)
router.post('/like-comment', commentController.likeComment)

///discussions functions
router.get('/discussion/:slug', discussionController.singleDiscussion)

router.get('/account/discussion',checker.authChecker, discussionController.accountDiscussion)
router.post('/account/discussion', discussionController.createDiscussion)
router.post('/get-edit-discussion', discussionController.getDiscussionEdit)
router.post('/delete-discussion', discussionController.deleteDiscussion)
router.post('/update/discussion', discussionController.updateDiscussion)


///feeds functions
router.get('/feed/:slug', feedController.singleFeed)

router.get('/account/feed',checker.authChecker, feedController.accountFeed)
router.post('/account/feed', feedController.createFeed)
router.post('/get-edit-feed', feedController.getFeedEdit)
router.post('/delete-feed', feedController.deleteFeed)
router.post('/update/feed', feedController.updateFeed)

///books functions
router.get('/book/:slug', bookController.singleBook)

router.get('/account/book',checker.authChecker, bookController.accountBook)
router.post('/account/book', bookController.createBook)
router.post('/get-edit-book', bookController.getBookEdit)
router.post('/delete-book', bookController.deleteBook)
router.post('/update/book', bookController.updateBook)

///audio functions
router.get('/audio/:slug', audioController.singleAudio)

router.get('/account/audio',checker.authChecker, audioController.accountAudio)
router.post('/account/audio', audioController.createAudio)
router.post('/get-edit-audio', audioController.getAudioEdit)
router.post('/delete-audio', audioController.deleteAudio)
router.post('/update/audio', audioController.updateAudio)

router.get('/account/audio-list/:id', audioController.accountAudioList)
router.post('/account/audio-list/:id', audioController.createAudiolist)
router.post('/get-edit-audio-list', audioController.getAudioListEdit)
router.post('/update/audio-list', audioController.updateAudioList)
router.post('/delete-audio-list', audioController.deleteAudioList)


///video functions
router.get('/video/:slug', videoController.singleVideo)

router.get('/account/video',checker.authChecker, videoController.accountVideo)
router.post('/account/video', videoController.createVideo)
router.post('/get-edit-video', videoController.getVideoEdit)
router.post('/delete-video', videoController.deleteVideo)
router.post('/update/video', videoController.updateVideo)

router.get('/account/video-list/:id', videoController.accountVideoList)
router.post('/account/video-list/:id', videoController.createVideolist)
router.post('/get-edit-video-list', videoController.getVideoListEdit)
router.post('/update/video-list', videoController.updateVideoList)
router.post('/delete-video-list', videoController.deleteVideoList)


///constroller for main pages
router.get('/', mainController.home)
router.get('/audio-courses',mainController.audioPage)
router.get('/video-courses',mainController.videoPage)
router.get('/news-feeds',mainController.feedPage)
router.get('/qna',mainController.qnaPage)
router.get('/discussion',mainController.discussionPage)
router.get('/book-courses',mainController.bookPage)
router.get('/account',checker.authChecker, mainController.accountPage)
/*router.get('', (req, res)=>{
    res.render('home',{title:"User Management System"})
})*/

///authControll router
router.get('/login',checker.sessionChecker, authController.loginForm)
router.get('/register',checker.sessionChecker, authController.registerForm)
router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/logout', authController.logout)

module.exports = router