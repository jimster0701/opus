"use client";
import { useEffect, useState } from "react";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/navigation";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";
import { AllFriendsPosts } from "../posts/allFriendsPosts";
import { type Interest } from "~/types/interest";
import { defaultInterest } from "~/const/defaultVar";
import { type SimpleUser, type User } from "~/types/user";
import { GainInterestModal } from "../modals";

interface friendsClientProps {
  user: User;
}

export default function FriendsClient(props: friendsClientProps) {
  const router = useRouter();
  const { theme } = useThemeStore();
  const [selectedTab, setSelectedTab] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState<SimpleUser[]>([]);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [newInterest, setNewInterest] = useState<Interest>(defaultInterest);
  const [hasMounted, setHasMounted] = useState(false);
  const [displayNameSearch, setDisplayNameSearch] = useState("");
  const [userInterests, setUserInterests] = useState<Interest[]>([
    defaultInterest,
  ]);

  const [searchResults, setSearchResults] = useState<SimpleUser[]>([]);

  const getUserInterests = trpc.user.getUserInterests.useQuery({
    userId: props.user.id,
  });

  const getSearchByDisplayName = trpc.user.searchByDisplayName.useQuery(
    {
      displayName: displayNameSearch,
    },
    { enabled: displayNameSearch != "" }
  );

  const getSuggestedUsers = trpc.user.getNewUsersByInterests.useQuery(
    { interestIds: userInterests.map((i) => i.id) },
    { enabled: userInterests.length != 0 }
  );

  const { data: friendsData, isLoading } = trpc.user.getFriends.useQuery();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (getSearchByDisplayName.isLoading || displayNameSearch == "") return;
    setSearchResults(getSearchByDisplayName.data as SimpleUser[]);
  }, [
    getSearchByDisplayName.isLoading,
    getSearchByDisplayName.data,
    displayNameSearch,
  ]);

  useEffect(() => {
    if (getUserInterests.isLoading) return;
    setUserInterests(getUserInterests.data as Interest[]);
  }, [getUserInterests.isLoading, getUserInterests.data]);

  useEffect(() => {
    if (getSuggestedUsers.isLoading || userInterests.length == 0) return;
    if (getSuggestedUsers.data && getSuggestedUsers.data.length > 0)
      setSuggestedUsers(getSuggestedUsers.data as SimpleUser[]);
  }, [
    getSuggestedUsers.isLoading,
    getSuggestedUsers.data,
    getSuggestedUsers.data?.length,
    userInterests.length,
  ]);

  if (!hasMounted) {
    return (
      <main
        className={
          theme === "default"
            ? `${styles.main}`
            : `${styles.main} ${styles[`theme-${theme}`]}`
        }
      ></main>
    );
  }

  return (
    <main
      className={
        theme === "default"
          ? `${styles.main}`
          : `${styles.main} ${styles[`theme-${theme}`]}`
      }
    >
      <div className={styles.container}>
        <div className={styles.discoverTabContainer}>
          <button
            autoFocus={selectedTab === "friends"}
            onClick={() => {
              setSelectedTab("posts");
            }}
          >
            Friends posts
          </button>
          <button
            onClick={() => {
              setSelectedTab("list");
            }}
          >
            Friends list
          </button>
          <button
            onClick={() => {
              setSelectedTab("search");
            }}
          >
            Find friends
          </button>
        </div>
        {(selectedTab == "posts" || selectedTab == "") && (
          <AllFriendsPosts
            setNewInterest={setNewInterest}
            setShowInterestModal={setShowInterestModal}
            userId={props.user.id}
          />
        )}
        {selectedTab == "list" && (
          <>
            <h1 className={styles.opusText}>Friends List</h1>
            {isLoading ? (
              <p className={styles.opusText}>Loading friends...</p>
            ) : friendsData && friendsData.length > 0 ? (
              <div className={styles.friendsContainer}>
                {friendsData.map((friend) => (
                  <div
                    key={friend.id}
                    className={styles.cardContainer}
                    onClick={() => {
                      router.push(`/profile/${friend.id}`);
                    }}
                  >
                    <ProfilePicturePreviewWrapper
                      id={friend.id}
                      imageUrl={friend.image ?? ""}
                      width={10}
                      height={10}
                    />
                    <p className={styles.opusText}>{friend.displayName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.opusText}>No friends found.</p>
            )}
          </>
        )}

        {selectedTab == "search" && (
          <>
            <input
              className={styles.displaySearchInput}
              placeholder={"Search..."}
              value={displayNameSearch}
              onChange={(e) => setDisplayNameSearch(e.target.value)}
            />
            {getSearchByDisplayName.isLoading && (
              <p className={styles.opusText}>Loading...</p>
            )}
            {!getSearchByDisplayName.isLoading && displayNameSearch == "" ? (
              <p className={styles.opusText}>Enter a name to search.</p>
            ) : (
              <>
                {searchResults.length == 0 ? (
                  <p className={styles.opusText}>No results found.</p>
                ) : (
                  <>
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className={styles.cardContainer}
                        onClick={() => {
                          router.push(`/profile/${user.id}`);
                        }}
                      >
                        <ProfilePicturePreviewWrapper
                          id={user.id}
                          imageUrl={user.image ?? ""}
                          width={10}
                          height={10}
                        />
                        <p className={styles.opusText}>{user.displayName}</p>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
            <div className={styles.suggestedUserContainer}>
              <h3 className={styles.opusText}>Suggested Users:</h3>
              {suggestedUsers.map((user) => (
                <div
                  key={user.id}
                  className={styles.cardContainer}
                  onClick={() => {
                    router.push(`/profile/${user.id}`);
                  }}
                >
                  <ProfilePicturePreviewWrapper
                    id={user.id}
                    imageUrl={user.image ?? ""}
                    width={10}
                    height={10}
                  />
                  <p className={styles.opusText}>{user.displayName}</p>
                </div>
              ))}
              {suggestedUsers.length == 0 && (
                <p className={styles.opusText}>
                  You are friends with everyone!
                </p>
              )}
            </div>
          </>
        )}
      </div>
      {showInterestModal && (
        <GainInterestModal
          interest={newInterest}
          userId={props.user.id}
          onComplete={() => setShowInterestModal(false)}
          userInterests={userInterests}
        />
      )}
    </main>
  );
}
