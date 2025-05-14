import styles from "../../index.module.css";
import { useEffect, useState } from "react";
import { type Interest } from "~/types/interest";
import { type Task } from "~/types/task";
import { type User } from "~/types/user";
import { trpc } from "~/utils/trpc";
import Taskbox from "./taskbox";
import toast from "react-hot-toast";

interface customTaskGeneratorProps {
  user: User;
}

export default function CustomTaskGenerator(props: customTaskGeneratorProps) {
  const [choosenFriend, setChoosenFriend] = useState("");
  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [friendsInterests, setFriendsInterests] = useState<Interest[]>([]);
  const [userInterests, setUserInterests] = useState<Interest[]>([]);
  const [choosenInterests, setChoosenInterests] = useState<Interest[]>([]);
  const [friends, setFriends] = useState<User[]>([]);

  const getFriends = trpc.user.getFriends.useQuery();

  const generateTask = trpc.task.generateFriendTask.useMutation({
    onSuccess: (data) => {
      setCreatedTasks((prev) => [data, ...prev]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getInterests = trpc.user.getUserInterests.useQuery({
    userId: props.user.id,
  });

  const getFriendsInterests = trpc.user.getUserInterests.useQuery(
    {
      userId: choosenFriend,
    },
    { enabled: choosenFriend != "" }
  );

  useEffect(() => {
    if (getFriends.isLoading) return;
    if (getFriends.data && getFriends.data?.length > 0) {
      setFriends(getFriends.data as User[]);
    }
  }, [getFriends.isLoading, getFriends.data?.length, getFriends.data]);

  useEffect(() => {
    if (getInterests.isLoading) return;
    if (getInterests.data && getInterests.data?.length > 0) {
      setUserInterests(getInterests.data as Interest[]);
    }
  }, [getInterests.isLoading, getInterests.data?.length, getInterests.data]);

  useEffect(() => {
    if (getFriendsInterests.isLoading) return;
    if (getFriendsInterests.data && getFriendsInterests.data?.length > 0) {
      setFriendsInterests(getFriendsInterests.data as Interest[]);
    }
  }, [
    getFriendsInterests.isLoading,
    getFriendsInterests.data?.length,
    getFriendsInterests.data,
  ]);

  const handleGenerate = () => {
    if (!choosenInterests[0] || !choosenInterests[1]) {
      toast.error("Please select both interests you want to mix");
      return;
    }

    const interestArray = choosenInterests.map((i) => ({
      id: i.id,
      name: i.name,
    }));

    generateTask.mutate({
      friendIds: [props.user.id, choosenFriend],
      interests: interestArray,
    });
  };

  const pickMix = () => {
    const min = 0;
    const max1 = userInterests.length;
    const max2 = friendsInterests.length;
    const rand1 = min + Math.random() * (max1 - min);
    const choice1 = userInterests[Math.floor(rand1)];
    let rand2 = min + Math.random() * (max2 - min);
    let choice2 = friendsInterests[Math.floor(rand2)];
    while (choice1?.id == choice2?.id) {
      rand2 = min + Math.random() * (max2 - min);
      choice2 = friendsInterests[Math.floor(rand2)];
    }
    return [choice1, choice2];
  };

  return (
    <div className={styles.taskList}>
      <div className={styles.taskGeneratorContainer}>
        <div>
          <h2>Generate a task with your friend</h2>
          <h3 className={styles.opusText} style={{ color: "black" }}>
            Choose interests to mix
          </h3>
        </div>
        <div className={styles.taskGeneratorPickContainer}>
          <div className={styles.taskGeneratorInterestsContainer}>
            <h3>Your Interests:</h3>
            <div className={styles.taskGeneratorInterests}>
              {userInterests.map((interest) => (
                <div
                  key={interest.id}
                  style={{
                    border: `${interest.colour} 1px solid`,
                    ["--text-glow" as any]: `linear-gradient(to top left,rgb(70, 70, 70), ${interest.colour})`,
                  }}
                  className={styles.glowingNugget}
                  onClick={() => {
                    if (interest.id != choosenInterests[1]?.id)
                      setChoosenInterests(
                        (prev) => [interest, prev[1]] as Interest[]
                      );
                    else toast.error("Interests cannot be the same");
                  }}
                >
                  <p className={styles.glowingNuggetText}>
                    {interest.icon}
                    {interest.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.taskGeneratorInterestsContainer}>
            <div className={styles.taskGeneratorFriendSelect}>
              <h3>Friends Interests:</h3>
              <select
                className={styles.opusSelector}
                onChange={(e) => {
                  if (e.target.value != "Choose a friend")
                    setChoosenFriend(e.target.value);
                }}
              >
                <option>Choose a friend</option>
                {friends.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.taskGeneratorInterests}>
              {friendsInterests.map((interest) => (
                <div
                  key={interest.id}
                  style={{
                    border: `${interest.colour} 1px solid`,
                    ["--text-glow" as any]: `linear-gradient(to top left,rgb(70, 70, 70), ${interest.colour})`,
                  }}
                  className={styles.glowingNugget}
                  onClick={() => {
                    if (interest.id != choosenInterests[0]?.id)
                      setChoosenInterests(
                        (prev) => [prev[0], interest] as Interest[]
                      );
                    else toast.error("Interests cannot be the same");
                  }}
                >
                  <p className={styles.glowingNuggetText}>
                    {interest.icon}
                    {interest.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p>or</p>
        <button
          className={styles.opusButton}
          style={{ color: "black" }}
          onClick={() => {
            setChoosenInterests(
              pickMix().filter((i): i is Interest => i !== undefined)
            );
          }}
        >
          Randomise 🎲
        </button>
        <div className={styles.taskGeneratorChoosenInterest}>
          {choosenInterests[0] ? (
            <div
              key={choosenInterests[0].id}
              style={{
                border: `${choosenInterests[0].colour} 1px solid`,
                ["--text-glow" as any]: `linear-gradient(to top left,rgb(70, 70, 70), ${choosenInterests[0].colour})`,
              }}
              className={styles.glowingNugget}
            >
              <p className={styles.glowingNuggetText}>
                {choosenInterests[0].icon}
                {choosenInterests[0].name}
              </p>
            </div>
          ) : (
            <div>Your Interest</div>
          )}
          <p style={{ fontSize: "large" }}>≈</p>
          {choosenInterests[1] ? (
            <div
              key={choosenInterests[1].id}
              style={{
                border: `${choosenInterests[1].colour} 1px solid`,
                ["--text-glow" as any]: `linear-gradient(to top left,rgb(70, 70, 70), ${choosenInterests[1].colour})`,
              }}
              className={styles.glowingNugget}
            >
              <p className={styles.glowingNuggetText}>
                {choosenInterests[1].icon}
                {choosenInterests[1].name}
              </p>
            </div>
          ) : (
            <div>Friends Interest</div>
          )}
        </div>
        <button
          className={styles.opusButton}
          style={{ color: "black" }}
          onClick={handleGenerate}
        >
          {!generateTask.isPending ? (
            "Generate"
          ) : (
            <span className={styles.loader} />
          )}
        </button>
        {createdTasks.length > 0 ? (
          createdTasks
            .sort((task1, task2) =>
              task1.completed === task2.completed ? 0 : task1.completed ? 1 : -1
            )
            .map((task) => (
              <Taskbox key={task.id} task={task} user={props.user} />
            ))
        ) : (
          <p className={styles.noTaskText}>No tasks have been generated.</p>
        )}
      </div>
    </div>
  );
}
