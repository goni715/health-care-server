
const createPrescriptionService = async(appointmentId: string, email: string, payload:any) => {
    return {
        appointmentId,
        email
    }
}




export {
    createPrescriptionService
}