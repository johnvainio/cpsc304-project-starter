/* eslint-disable */
import { Router } from 'express'

var connection = require('../configs/sequelize')
const bodyParser = require('body-parser')

const router = Router()

router.get('/patient/appointments/:patientid', function (req, res, next) {
    const patientid = req.params.patientid
    const timeFormat = "YYYY/MM/DD HH24:MI"
    const query = 'SELECT ' +
        'cast(appointmentdatetime AS date) date, cast(appointmentdatetime AS TIME) aptime, to_char(appointmentdatetime, :timeFormat) appointmentdatetime, ' +
        'duration, doctorname, a.doctorid, address ' +
        'FROM (SELECT * FROM Appointments WHERE patientid = :patientid) a, doctor d ' +
        'WHERE a.doctorid = d.doctorid ORDER BY appointmentdatetime;'
    connection.query(query, {
        type: connection.QueryTypes.SELECT,
        replacements: {
            patientid: patientid,
            timeFormat: timeFormat
        }
    })
        .then(users => {
            res.json(users)
        })
})

router.post('/patient/makeAppointment/:patientid', bodyParser.json(), function (req, res, next) {
    const patientid = req.params.patientid
    const doctorid = req.body.data.doctorid
    const datetime = req.body.data.date + ' ' + req.body.data.booktime
    const duration = req.body.data.duration
    const timeFormat = "YYYY/MM/DD HH24:MI"

    const query = 'INSERT INTO Appointments Values (:patientid, :doctorid, TO_TIMESTAMP(:datetime, :timeFormat), :duration)'
    connection.query(query, {
        type: connection.QueryTypes.INSERT,
        replacements: {
            patientid: patientid,
            doctorid: doctorid,
            datetime: datetime,
            duration: duration,
            timeFormat: timeFormat
        }
    })

})

router.post('/patient/makeAppointment/:patientid', bodyParser.json(), function (req, res, next) {
    const patientid = req.params.patientid
    const doctorid = req.body.data.doctorid
    const datetime = req.body.data.date + ' ' + req.body.data.booktime
    const duration = req.body.data.duration
    const timeFormat = "YYYY/MM/DD HH24:MI"

    const query = 'INSERT INTO Appointments Values (:patientid, :doctorid, TO_TIMESTAMP(:datetime, :timeFormat), :duration)'
    connection.query(query, {
        type: connection.QueryTypes.INSERT,
        replacements: {
            patientid: patientid,
            doctorid: doctorid,
            datetime: datetime,
            duration: duration,
            timeFormat: timeFormat
        }
    })

})

router.post('/patient/updateAppointment/:patientid', bodyParser.json(), function (req, res, next) {
    const patientid = req.params.patientid
    const doctorid = req.body.data.doctorid
    const datetime = req.body.data.date + ' ' + req.body.data.booktime
    const duration = req.body.data.duration
    const appointmentdatetime = req.body.data.appointmentdatetime
    const timeFormat = "YYYY/MM/DD HH24:MI"


    const query = 'UPDATE Appointments ' +
        'SET doctorid = :doctorid, appointmentdatetime = TO_TIMESTAMP(:datetime, :timeFormat)' +
        'WHERE patientid = :patientid AND appointmentdatetime = :appointmentdatetime;'
    connection.query(query, {
        type: connection.QueryTypes.INSERT,
        replacements: {
            patientid: patientid,
            doctorid: doctorid,
            datetime: datetime,
            duration: duration,
            timeFormat: timeFormat,
            appointmentdatetime: appointmentdatetime
        }
    })

})

router.post('/patient/cancelAppointment/:patientid', bodyParser.json(), function (req, res, next) {
    const patientid = req.params.patientid
    const datetime = req.body.data.datetime

    const query = 'DELETE FROM Appointments WHERE patientid = :patientid AND appointmentdatetime = :datetime'
    connection.query(query, {
        type: connection.QueryTypes.DELETE,
        replacements: {
            patientid: patientid,
            datetime: datetime
        }
    })
})

export default router