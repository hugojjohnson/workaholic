// // components/RoutePrefetcher.tsx
// // currently doesn't work. Including it in case I ever come back and want to fix this.
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export function RoutePrefetcher() {
//   const router = useRouter();

//   useEffect(() => {
//     if ("requestIdleCallback" in window) {
//       requestIdleCallback(() => {
//         router.prefetch("/profile");
//         router.prefetch("/dashboard");
//         router.prefetch("/settings");
//       });
//     } else {
//       router.prefetch("/profile");
//       router.prefetch("/dashboard");
//       router.prefetch("/settings");
//     }
//   }, []);

//   return null;
// }
