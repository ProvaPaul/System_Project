// src/redux/actions/userActions.js
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "../authSlice"; // Adjust the path if needed

export const fetchUserProfile = () => async (dispatch) => {
    try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
        if (res.data.success) {
            dispatch(setUser(res.data.user));
        }
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
    }
};
