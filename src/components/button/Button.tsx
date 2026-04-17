import { Link } from "react-router";
import styles from "./Button.module.css";

// A reusable button component that links to a different page in the app.
function Button({ text, to }: { text: string; to: string }) {
  return (
    <Link to={to} className={styles.link}>
      <button className={styles.button}>{text}</button>
    </Link>
  );
}

export default Button;
