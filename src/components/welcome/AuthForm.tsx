// import { useState } from "react";
// import { Button } from "~/components/ui/button";
// import { Input } from "~/components/ui/input";
// import { Label } from "~/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
// import { Separator } from "~/components/ui/separator";
// import { Loader2 } from "lucide-react";

// export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
//     const [loading, setLoading] = useState(false);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     async function onSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         setLoading(true);
//         // TODO: Wire your sign in/up logic here
//         // Probably call NextAuth signIn() or your backend API
//         setTimeout(() => setLoading(false), 1500); // fake delay
//     }

//     return (
//         <main className="min-h-screen flex justify-center items-center bg-background p-6">
//             <Card className="w-full max-w-md">
//                 <CardHeader>
//                     <CardTitle className="text-center text-2xl font-bold">
//                         {mode === "signin" ? "Sign In" : "Sign Up"}
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={onSubmit} className="space-y-6">
//                         <div>
//                             <Label htmlFor="email">Email</Label>
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 autoComplete="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                                 placeholder="your.email@example.com"
//                             />
//                         </div>
//                         <div>
//                             <Label htmlFor="password">Password</Label>
//                             <Input
//                                 id="password"
//                                 type="password"
//                                 autoComplete={mode === "signin" ? "current-password" : "new-password"}
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                                 placeholder="********"
//                             />
//                         </div>
//                         <Button type="submit" disabled={loading} className="w-full">
//                             {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : mode === "signin" ? "Sign In" : "Create Account"}
//                         </Button>
//                     </form>

//                     <Separator className="my-6" />

//                     <Button
//                         variant="outline"
//                         className="w-full flex items-center justify-center gap-2"
//                         onClick={() => {
//                             setLoading(true);
//                             // TODO: Trigger Google sign in here, e.g. signIn('google')
//                             setTimeout(() => setLoading(false), 1500);
//                         }}
//                         disabled={loading}
//                     >
//                         <img
//                             src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
//                             alt="Google logo"
//                             className="inline-block w-5 h-5 ml-5"
//                         />
//                         {/* <Google className="h-5 w-5" /> */}
//                         Continue with Google
//                     </Button>
//                 </CardContent>
//             </Card>
//         </main>
//     );
// }
