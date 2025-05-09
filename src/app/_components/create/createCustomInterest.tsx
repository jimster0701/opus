import { trpc } from "~/utils/trpc";
import styles from "../../index.module.css";
import { useState, Fragment } from "react";
import { Interest } from "~/types/interest";
import { User } from "~/types/user";
import { X } from "lucide-react";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex } from "@uiw/color-convert";

interface createCustomInterestProps {
  user: User;
}

export default function CreateCustomInterest(props: createCustomInterestProps) {
  const [interestName, setInterestName] = useState("");
  const [interestIcon, setInterestIcon] = useState("");
  const [interestPrivate, setInterestPrivate] = useState(false);
  const [interestDeleted, setInterestDeleted] = useState(0);
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const [submitError, setSubmitError] = useState([false, ""]);
  const [customInterests, setCustomInterests] = useState<Interest[]>(
    props.user.createdInterests ?? []
  );

  const addCustomInterest = trpc.interest.createInterest.useMutation({});
  const deleteCustomInterest = trpc.interest.deleteInterest.useMutation({});

  return (
    <>
      <form className={styles.modalForm}>
        <label htmlFor="newInterestName">Create a new interest:</label>
        <div className={styles.selectInterestModalInputContainer}>
          <input
            type="text"
            id="newInterestIcon"
            name="newInterestIcon"
            className={styles.selectInterestModalIconInput}
            placeholder={"icon"}
            required
            value={interestIcon}
            onChange={(e) => {
              const newIcon = e.target.value;
              setSubmitError([false, ""]);
              const emojiRegex = `(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])`;
              if (RegExp(emojiRegex).test(newIcon)) {
                setSubmitError([true, "Interest icon must be an emoji"]);
              } else {
                setInterestIcon(newIcon);
              }
            }}
            onClick={() => setSubmitError([false, ""])}
            autoComplete="off"
          />
          <input
            type="text"
            id="newInterestName"
            name="newInterestName"
            className={styles.selectInterestModalInterestInput}
            placeholder="Interesting..."
            required
            value={interestName}
            onChange={(e) => {
              const newName = e.target.value;
              if (newName.length > 20) {
                setSubmitError([
                  true,
                  "Interest name must be less than 20 characters",
                ]);
              } else {
                setSubmitError([false, ""]);
                setInterestName(newName);
              }
            }}
            onClick={() => setSubmitError([false, ""])}
            autoComplete="off"
          />
          <button
            className={styles.selectInterestModalInterestButton}
            onClick={async (e) => {
              setSubmitError([false, ""]);
              if (interestIcon.length == 0) return;
              e.preventDefault();
              const interest = await addCustomInterest.mutateAsync({
                name: interestName,
                icon: interestIcon,
                colour: hsvaToHex(hsva),
                private: interestPrivate,
              });
              setCustomInterests((prev) => [interest as Interest, ...prev]);
              setInterestIcon("");
              setInterestName("");
            }}
            disabled={interestName.length < 1 || interestName.length > 20}
          >
            Add
          </button>
          <br />
        </div>
        <div className={styles.selectInterestModalPrivateContainer}>
          <p>Make this interest friends only:</p>
          <input
            type="checkbox"
            checked={interestPrivate}
            onChange={(e) => setInterestPrivate(e.target.checked)}
          />
        </div>

        {submitError[0] && (
          <div className={styles.errorTooltip}>{submitError[1]}</div>
        )}
        <Fragment>
          <Wheel
            color={hsva}
            onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
          />
          <div
            style={{
              width: "100%",
              height: 34,
              marginTop: 20,
              background: hsvaToHex(hsva),
            }}
          ></div>
        </Fragment>
      </form>
      <div className={styles.selectInterestModalCustomInterestContainer}>
        <h2>Your custom interests</h2>
        {customInterests.length == 0 ? (
          <div className={styles.selectInterestModalCustomInterest}>
            No custom interests created.
          </div>
        ) : (
          customInterests.map((custom) => (
            <div
              key={custom.id}
              style={{ borderColor: custom.colour }}
              className={styles.selectInterestModalCustomInterest}
            >
              <div>
                <p>{custom.icon}</p>
                <p>{custom.name}</p>
              </div>
              {interestDeleted == custom.id &&
              deleteCustomInterest.isPending ? (
                <span className={styles.loader} />
              ) : (
                <X
                  onClick={async () => {
                    setInterestDeleted(custom.id);
                    await deleteCustomInterest.mutateAsync({ id: custom.id });
                    setCustomInterests(
                      customInterests.filter((i) => i.id != custom.id)
                    );
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
