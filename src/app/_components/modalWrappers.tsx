"use client";

import { useState, useEffect } from "react";
import { NewUserModal } from "./modals";

export function NewUserModalWrapper({
  displayName,
}: {
  displayName: string | null;
}) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!displayName) {
      setShowModal(true);
    }
  }, [displayName]);

  return showModal ? (
    <NewUserModal onComplete={() => setShowModal(false)} />
  ) : null;
}
