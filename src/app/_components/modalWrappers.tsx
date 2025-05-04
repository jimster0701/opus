"use client";

import { useState, useEffect } from "react";
import { NewUserModal } from "./modals";
import { trpc } from "~/utils/trpc";
import { type Interest } from "~/types/interest";
import { defaultInterest } from "~/const/defaultVar";

interface newUserWrapperProps {
  displayName: string | null;
  userId: string;
}

export function NewUserModalWrapper(props: newUserWrapperProps) {
  const [showModal, setShowModal] = useState(false);
  const [interests, setInterests] = useState<Interest[]>([defaultInterest]);

  const getInterests = trpc.user.getUserInterests.useQuery({
    userId: props.userId,
  });

  useEffect(() => {
    if (getInterests.isLoading) return;
    setInterests(getInterests.data as Interest[]);
  }, [getInterests.isLoading, getInterests.data]);

  useEffect(() => {
    if (getInterests.isLoading) return;
    if (!props.displayName || interests.length == 0) {
      setShowModal(true);
    }
  }, [props.displayName, getInterests.isLoading, interests]);

  return showModal ? (
    <NewUserModal onComplete={() => setShowModal(false)} />
  ) : null;
}
