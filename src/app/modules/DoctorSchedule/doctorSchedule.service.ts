import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";




const createDoctorScheduleService = async(email: string, payload: TDoctorSchedule) => {
    const { schedules } = payload;
    const doctorExist = await prisma.doctor.findFirst({
        where: {
            email
        }
    })


    //check if doctorId does not exist
    if(!doctorExist) {
        throw new ApiError(404, "doctorId does not exist");
    }



    const dataArr = schedules?.map((item)=> ({
        doctorId: doctorExist.id,
        scheduleId : item
    }))


    const schedulesDataArr: any[] = [];

   for(const item of dataArr){
        const doctorScheduleExist = await prisma.doctorSchedules.findMany({
            where: {
                doctorId: item.doctorId,
                scheduleId: item.scheduleId
            }
        })

        //check doctorId & scheduleId is already existed
        if(doctorScheduleExist.length === 0){
            schedulesDataArr.push(item)
        }
    }
    

    const result = await prisma.doctorSchedules.createMany({
        data: schedulesDataArr
    })
    
    return result;
}



export {
    createDoctorScheduleService
}