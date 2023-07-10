const express = require('express');
const router = express.Router();
const multer = require('multer');

// MULTER UPLOAD
const upload = require('../middlewares/multer');
const {
    updateDocument,
    findDocument,
    insertDocument,
    insertDocuments,
} = require('../helpers/MongoDbHelper');
const Media = require('../models/Media');
// const { Media } = require('../models');

router.post('/upload-single', (req, res) =>
    upload.single('file')(req, res, async(err) => {
        try {
            if (err instanceof multer.MulterError) {
                res.status(500).json({ type: 'MulterError', err: err });
            } else if (err) {
                res.status(500).json({ type: 'UnknownError', err: err });
            } else {
                console.log('««««« file »»»»»', req.file);

                const name = req.file.filename;
                const employeeId = req.user._id;

                console.log('««««« req.user »»»»»', req.user);
                const imageUrl = `/uploads/media/${name}`;

                const response = await insertDocument({ location: imageUrl, name, employeeId },
                    'Media',
                );
                res.status(200).json({
                    message: 'Tải lên thành công',
                    payload: response.result,
                });
            }
        } catch (error) {
            console.log('««««« error »»»»»', error);
            console.log('««««« co chay vo day ma ko hieu sao loi »»»»»');

            res.status(500).json({ ok: false, error });
        }
    }),
);

router.post('/upload-multiple', (req, res) =>
    upload.array('files', 3)(req, res, async(err) => {
        try {
            if (err instanceof multer.MulterError) {
                res.status(500).json({ type: 'MulterError', err: err });
            } else if (err) {
                res.status(500).json({ type: 'UnknownError', err: err });
            } else {
                const files = req.files;
                const employeeId = req.user._id;

                const dataInsert = files.reduce((prev, nextP) => {
                    prev.push({
                        name: nextP.filename,
                        location: nextP.path,
                        employeeId,
                    });
                    return prev;
                }, []);

                const response = await insertDocuments(dataInsert, 'Media');

                res.status(200).json({
                    message: "Tải lên nhiều file được rồi đó",
                    payload: response,
                });
            }
        } catch (error) {
            res.status(500).json({ message: "Có lỗi sảy ra", error });
        }
    }),
);

// router.get('/media/:id', async (req, res, next) => {
//   const { id } = req.params;

//   const found = await findDocument(id, 'Media');
//   if (!found) {
//     return res
//       .status(410)
//       .json({ message: `${collectionName} with id ${id} not found` });
//   }

//   res.status(200).json({ ok: true, payload: found });
// });

router.post('/update/:id', async(req, res) => {
    const { id } = req.params;

    const found = await findDocument(id, 'Media');

    console.log('««««« found »»»»»', found);

    if (!found) res.status(410).json({ message: `Media with id ${id} not found` });

    upload.single('file')(req, res, async(err) => {
        try {
            if (err instanceof multer.MulterError) {
                res.status(500).json({ type: 'MulterError', err: err });
            } else if (err) {
                res.status(500).json({ type: 'UnknownError', err: err });
            } else {
                const imageUrl = `/uploads/media/${req.file.filename}`;
                const name = req.file.filename;
                const employeeId = req.user._id;

                // updateOne | findByIdAndUpdate
                const response = await updateDocument({ _id: id }, {
                        location: imageUrl,
                        name,
                        employeeId,
                    },
                    'Media',
                );

                res.status(200).json({ ok: true, payload: response });
            }
        } catch (error) {
            res.status(500).json({ ok: false, error });
        }
    });
});

module.exports = router;