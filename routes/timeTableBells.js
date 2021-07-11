const { TimeTableBell } = require('../models/timeTableBell')
const { Bell } = require('../models/bell');
const { Day } = require('../models/day');
const { Master } = require('../models/master');

const isAuthenticated = require("../middleware/isAuthenticated");
const isAdminOrMaster = require("../middleware/isAdminOrMaster")
const isMaster = require('../middleware/isMaster')

const router = require("express").Router();
const config = require('../config/development-config.json');



/*
    /api/TimeTableBells
*/

/* 
    /api/TimeTableBells/

    Only [Master, Admin] access
        Admin:
            Access all 
        Master:
            Access own
*/
router.get("/", isAuthenticated, isAdminOrMaster, async (req, res) => {

    if( req.user.role == 'Admin'){

        await TimeTableBell
        .find({}) 
        .populate({ path: "Day" })
        .populate({ path: "Bell" })
        .exec( (err, timeTableBells) => {
            if(err)
                return res.status(config.HTTP.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Server encountered problems while processing this request.",   
                });

            timeTableBells_list = []

            for(const timeTableBell of timeTableBells){
                timeTableBells_list.push({
                    id: timeTableBell._id,
                    day: {
                        id: timeTableBell.Day._id,
                        label: timeTableBell.Day.label,
                        dayOfWeek: timeTableBell.Day.dayOfWeek
                    },
                    bell:{
                        id: timeTableBell.Bell._id,
                        label: timeTableBell.Bell.label,
                        bellOfDay: timeTableBell.Bell.bellOfDay
                    }
                })
            }


            const totalNumberOfPages = Math.ceil(timeTableBells_list.length / req.query.PageSize); 
            const startIndex = (req.query.Page - 1) * req.query.PageSize;
            const trimmedList = timeTableBells_list.slice(startIndex, startIndex + parseInt(req.query.PageSize));

            return res.status(config.HTTP.OK).json({
                success: true,
                message: "Time Table Bell list retrieved",
                data: {
                    list : trimmedList,
                    page : req.query.Page,
                    count: trimmedList.length,
                    totalPages : totalNumberOfPages
                }         
            });
            
        })
    }
    else{
        await Master
        .findOne({ user : req.user._id})
        .populate({path: "timeTableBells"})
        .exec( async (err, user_master) => {
    
            if(err)
                return res.status(config.HTTP.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Server encountered problems while processing this request.",   
                });

            timeTableBells_list = []

            for(const timeTableBell of user_master.timeTableBells){
                timeTableBells_list.push({
                    id: timeTableBell._id,
                    day: {
                        id: timeTableBell.Day._id,
                        label: timeTableBell.Day.label,
                        dayOfWeek: timeTableBell.Day.dayOfWeek
                    },
                    bell:{
                        id: timeTableBell.Bell._id,
                        label: timeTableBell.Bell.label,
                        bellOfDay: timeTableBell.Bell.bellOfDay
                    }
                })
            }
            const totalNumberOfPages = Math.ceil(timeTableBells_list.length / req.query.PageSize); 
            const startIndex = (req.query.Page - 1) * req.query.PageSize;
            const trimmedList = timeTableBells_list.slice(startIndex, startIndex + parseInt(req.query.PageSize));

            return res.status(config.HTTP.OK).json({
                success: true,
                message: "Time Table Bell list retrieved",
                data: {
                    list : trimmedList,
                    page : req.query.Page,
                    count: trimmedList.length,
                    totalPages : totalNumberOfPages
                }         
            });
        });
    }
});

/* 
    /api/TimeTableBells/12 

    Only [Master, Admin] access
        Admin:
            Access all 
        Master:
            Access own
*/
router.get("/:id", isAuthenticated, isAdminOrMaster, async (req, res) => {
    if( req.user.role == 'Admin'){
        await TimeTableBell.findOne( { _id :req.params['id']})
        .exec(async (err, timeTableBell) => {
            if(err)
                return res.status(config.HTTP.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Server encountered problems while processing this request.",   
                });
            if(!timeTableBell)
                return res.status(config.HTTP.BAD_REQUEST).json({
                    success: false,
                    message: "Time Table Bell doesn't exist.",       
                }); 
            await timeTableBell.populate('Day')
                               .populate('Bell')
                               .execPopulate()

            return res.status(config.HTTP.OK).json({
                success: true,
                message: "Time Table Bell retrieved successfully.",
                data: {
                    id: timeTableBell._id,
                    day: {
                        id: timeTableBell.Day._id,
                        label: timeTableBell.Day.label,
                        dayOfWeek: timeTableBell.Day.dayOfWeek
                    },
                    bell:{
                        id: timeTableBell.Bell._id,
                        label: timeTableBell.Bell.label,
                        bellOfDay: timeTableBell.Bell.bellOfDay
                    }
                }   
            });    
            
        });
    }
    else{
        await Master.find({ $and : [{user : req.user._id, }, { timeTableBells :  req.params['id'] }] } )
        .exec( async (err, master_user) => {
            if(err)
                return res.status(config.HTTP.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Server encountered problems while processing this request.",   
                });
            if(!master_user || master_user.length == 0)
                return res.status(config.HTTP.BAD_REQUEST).json({
                    success: false,
                    message: "Time Table Bell doesn't exist.",       
                }); 

            timeTableBell = await TimeTableBell.findOne({ _id: req.params['id']})
            .populate('Day')
            .populate('Bell')

            return res.status(config.HTTP.OK).json({
                success: true,
                message: "Time Table Bell retrieved successfully.",
                data: {
                    id: timeTableBell._id,
                    day: {
                        id: timeTableBell.Day._id,
                        label: timeTableBell.Day.label,
                        dayOfWeek: timeTableBell.Day.dayOfWeek
                    },
                    bell:{
                        id: timeTableBell.Bell._id,
                        label: timeTableBell.Bell.label,
                        bellOfDay: timeTableBell.Bell.bellOfDay
                    }
                }   
            });   
        })
    }
});

/* /api/TimeTableBells/ */
router.post("/", isAuthenticated, isMaster, async (req, res) => {

    const bell = await Bell.findOne({ _id : req.body.bellId}, async (err, bell_exists) => {
        if(err || !bell_exists)
            return res.status(config.HTTP.BAD_REQUEST).json({
                success: false,
                message: "Bell doesn't exist.",       
            }); 
    } )
    const day = await Day.findOne({ _id : req.body.dayId}, async (err, day_exists) => {
        if(err || !day_exists)
            return res.status(config.HTTP.BAD_REQUEST).json({
                success: false,
                message: "Day doesn't exist.",       
            }); 
    } )

    await Master
    .findOne({ user : req.user._id})
    .populate({path: "timeTableBells"})
    .exec( async (err, user_master) => {

        if(err)
            return res.status(config.HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Server encountered problems while processing this request.",   
            });
        
        const d = []

        for( const timeTableBell of user_master.timeTableBells){
            if(timeTableBell.Day == req.body.dayId && timeTableBell.Bell == req.body.bellId)
                return res.status(config.HTTP.BAD_REQUEST).json({
                    success: false,
                    message: "Time Table Bell already exists.",       
                }); 
        }

        new_timeTableBell = new TimeTableBell({
            Day: req.body.dayId,
            Bell: req.body.bellId
        })

        await new_timeTableBell.save()

        user_master.timeTableBells.push(new_timeTableBell)

        await user_master.save()
    
        return res.status(config.HTTP.OK).json({
            success: true,
            message: "Time Table Bell added successfully.",
            data: {
                id: new_timeTableBell._id,
                day: {
                    id: day._id,
                    label: day.label,
                    dayOfWeek: day.dayOfWeek
                },
                bell:{
                    id: bell._id,
                    label: bell.label,
                    bellOfDay: bell.bellOfDay
                }
            }   
        });
    })
});

/* /api/TimeTableBells/12 */
router.delete("/:id", isAuthenticated, isAdminOrMaster, async (req, res) => {
    /* TODO: when admin removes a ttb, the ref in master is still there. you should remove the foreign references too*/
    if( req.user.role == 'Admin'){

        await TimeTableBell.findByIdAndDelete(req.params["id"])
        .exec( async (err, timeTableBell) => {
            if(err)
                return res.status(config.HTTP.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Server encountered problems while processing this request.",   
                });
            if(!timeTableBell)
                return res.status(config.HTTP.BAD_REQUEST).json({
                    success: false,
                    message: "Time Table Bell doesn't exist.",       
                }); 

            await timeTableBell.populate("Day").populate("Bell").execPopulate()

            return res.status(config.HTTP.OK).json({
                success: true,
                message: "Time Table Bell deleted successfully.",
                data: {
                    id: timeTableBell._id,
                    day: {
                        id: timeTableBell.Day._id,
                        label: timeTableBell.Day.label,
                        dayOfWeek: timeTableBell.Day.dayOfWeek
                    },
                    bell:{
                        id: timeTableBell.Bell._id,
                        label: timeTableBell.Bell.label,
                        bellOfDay: timeTableBell.Bell.bellOfDay
                    }
                }   
            });    
        })
    }
    else{

        await Master
        .updateOne({ user : req.user._id} , { $pull: { timeTableBells :  req.params['id'] } } )
        .exec( async (err, query_result) => {
            if(err)
                return res.status(config.HTTP.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Server encountered problems while processing this request.",   
                });
            if(query_result.nModified == 0)
                return res.status(config.HTTP.BAD_REQUEST).json({
                    success: false,
                    message: "Time Table Bell doesn't exist.",       
                }); 
            

            const timeTableBell = await TimeTableBell
                                        .findByIdAndDelete(req.params['id'])
                                        .populate("Day")
                                        .populate("Bell")
            
            return res.status(config.HTTP.OK).json({
                success: true,
                message: "TimeTableBell Deleted Successfully",
                data: {
                    id: timeTableBell._id,
                    day: {
                        id: timeTableBell.Day._id,
                        label: timeTableBell.Day.label,
                        dayOfWeek: timeTableBell.Day.dayOfWeek
                    },
                    bell:{
                        id: timeTableBell.Bell._id,
                        label: timeTableBell.Bell.label,
                        bellOfDay: timeTableBell.Bell.bellOfDay
                    }
                }  
            });    
        })
    }
});


module.exports = router;