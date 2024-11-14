import { UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common.interface";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";


const fetchMetaDataService = async(user: IAuthUser) => {
    switch (user?.role){
        case UserRole.super_admin:
             return await getSuperAdminMetaData();
             break
        case UserRole.admin:
             return await getAdminMetaData();
             break
        case UserRole.doctor:
             return await getDoctorMetaData(user);
             break
        case UserRole.patient:
             return await getPatientMetaData(user);
             break
        default:
            throw new Error('Something Went Wrong')
    }
}


const getSuperAdminMetaData = async () => {
    const appointmentCount = await prisma.appointment.count();
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const adminCount = await prisma.admin.count();
    const paymentCount = await prisma.payment.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {amount:true}
    })

    return {
        appointmentCount,
        patientCount,
        doctorCount,
        adminCount,
        paymentCount,
        totalRevenue
    }
}

const getAdminMetaData = async () => {
    const appointmentCount = await prisma.appointment.count();
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const paymentCount = await prisma.payment.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {amount:true}
    })

    return {
        appointmentCount,
        patientCount,
        doctorCount,
        paymentCount,
        totalRevenue
    }
}

const getDoctorMetaData = async (user: IAuthUser) => {
    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    })

    if(!doctorData){
        throw new ApiError(404, 'Doctor does not exist')
    }

    const appointmentCount = await prisma.appointment.count({
        where: {
            doctorId: doctorData.id
        }
    })

    const patientCount = await prisma.appointment.groupBy({
        by:['patientId'],
        where: {
            doctorId: doctorData.id,
        }
    })


    const reviewCount = await prisma.review.count({
        where: {
            doctorId: doctorData.id,
        }
    })


    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment:{
                doctorId: doctorData.id
            },
            status: 'PAID'
        }
    })

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: {id:true},
        where: {
            doctorId: doctorData.id
        }
    })


    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }))

    return {
        appointmentCount,
        patientCount: patientCount.length,
        reviewCount,
        totalRevenue,
        formattedAppointmentStatusDistribution
    }


}

const getPatientMetaData = async (user: IAuthUser) => {
    const patientData = await prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });

    if(!patientData){
        throw new ApiError(404, 'patient does not exist')
    }

    const appointmentCount = await prisma.appointment.count({
        where: {
            patientId: patientData.id
        }
    });

    const prescriptionCount = await prisma.prescription.count({
        where: {
            patientId: patientData.id
        }
    });

    const reviewCount = await prisma.review.count({
        where: {
            patientId: patientData.id
        }
    });

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            patientId: patientData.id
        }
    });

    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }))

    return {
        appointmentCount,
        prescriptionCount,
        reviewCount,
        formattedAppointmentStatusDistribution
    }
}


export {
    fetchMetaDataService
}