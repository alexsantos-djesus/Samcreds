"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";

type Props = { size?: number; className?: string; title?: string };

export function WhatsIcon({
  size = 18,
  className = "",
  title = "WhatsApp",
}: Props) {
  return (
    <FontAwesomeIcon
      icon={faWhatsapp}
      title={title}
      style={{ fontSize: size }}
      className={className}
    />
  );
}

export function InstaIcon({
  size = 18,
  className = "",
  title = "Instagram",
}: Props) {
  return (
    <FontAwesomeIcon
      icon={faInstagram}
      title={title}
      style={{ fontSize: size }}
      className={className}
    />
  );
}
