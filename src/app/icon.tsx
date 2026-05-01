import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, rgba(247,242,232,1) 0%, rgba(240,213,184,1) 100%)",
          color: "#8c3d24",
          fontSize: 208,
          fontWeight: 700,
          borderRadius: 96,
        }}
      >
        B
      </div>
    ),
    size,
  );
}
