import React from "react";
import styles from "./UserInfo.module.scss";
import Avatar from "@mui/material/Avatar";

export const UserInfo = ({ avatarUrl, fullName, updatedAt }) => {
  return (
    <div className={styles.root}>
      <Avatar
        className={styles.avatar}
        src={avatarUrl ? process.env.REACT_APP_API_URI + avatarUrl : ""}
        alt={fullName}
      />
      {/* <img className={styles.avatar} src={avatarUrl || ''} alt={fullName} /> */}
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{timeConverter(updatedAt)}</span>
      </div>
    </div>
  );
};

function timeConverter(timestamp){
  const a = new Date(timestamp);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  let min = a.getMinutes();
  min = String(min).length === 1 ? ("0" + min) : min;
  const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
  return time;
}
