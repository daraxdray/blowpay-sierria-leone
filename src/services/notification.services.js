import { request } from "./api";


class NotificationServices {

  /**
   *
   * @return {Promise<*>}
   */
  getNotifications(){
    return request(
        "/notification", "GET",
        undefined, false, false, false,
    )
  }


  /**
   * @param {string} id
   * @return {Promise<*>}
   */
  getNotById(id){
    return request(
        `/notification/${id}`, "GET",
        undefined, false, false, false,
    )
  }
}

export default new NotificationServices();
