// Import ES module functions
import getToken from '../requests/get_token.request.js';
import getUserID from '../requests/get_user_id.request.js';
import getStaffAppointments from '../requests/get_staff_appointments.request.js';
import deleteAppointment from '../requests/delete_appointment.request.js';
import moment from 'moment';

async function deleteUnpaidAppointments (file) {
  const token = await getToken(file)

  const userID = await getUserID(file, token)

  for (let i = 0; i < 14; i++) {
    const date = moment().add(i - 1, 'day').format('YYYY-MM-DD')

    await getStaffAppointments(file, userID, token, date).then(async (allStaff) => {
      const appointmentList = allStaff.filter(item => item.calendarDays[0].events.length > 0)
        .flatMap(item => item.calendarDays[0].events)

      const filterOutBreaksFromEvents = appointmentList.filter(item => item.__typename !== 'Break')

      const filterEvents = filterOutBreaksFromEvents.filter(item => item.state !== 'PAID')

      const appointmentIDs = []

      for (let i = 0; i < filterEvents.length; i++) {
        const t = filterEvents[i].id
        appointmentIDs.push(t)
      }

      console.log(date + ' -> ' + appointmentIDs.length + ' unpaid appointments to delete!')

      for (let i = 0; i < appointmentIDs.length; i++) {
        await deleteAppointment(file, token, userID, appointmentIDs[i])
      }
    })
  }
}
export default deleteUnpaidAppointments;
