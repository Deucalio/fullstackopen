import { useSelector } from "react-redux";

const Notification = () => {
  const { notification } = useSelector((store) => store);
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };
  return <div style={style}>{notification}</div>;
};
export default Notification;
