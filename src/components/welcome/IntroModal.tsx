"use client";
import { useRouter } from "next/navigation"; // or "next/router" if pre-next13
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Button } from "../ui/button";


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { DialogTitle } from "@radix-ui/react-dialog";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";


// import required modules


const slides = [
    {
        title: "Welcome to Workaholic!",
        description: "Make study a science by tracking your study habits this semester.",
        route: "/",
    },
    {
        title: "Log everything",
        description: "Log your lectures, tutorials, private study and anything else you do - so long as it's focused work.",
        route: "/",
    },
    {
        title: "Make it your own",
        description: "Customise your subjects, request bugs and features, and add logs if you forgot to log them.",
        route: "/settings",
    },
    {
        title: "Get stats",
        description: "Get detailed breakdowns of your study habits and subject spread.",
        route: "/reports",
    },
    {
        title: "Start exploring!",
        description: "You're all set to dive in and be productive.",
        route: "/",
    },
];

interface IntroModalProps {
    onComplete: () => void;
}


export default function IntroModal({ onComplete }: IntroModalProps) {
    const router = useRouter();
    const session = useSession();
    const [open, setOpen] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const isLast = currentSlide === slides.length - 1;

    const utils = api.useUtils();

    const finishIntro = api.preferences.completeIntro.useMutation({
        onMutate: async () => {
            await utils.user.get.cancel();
            const previousData = utils.user.get.getData();
            // Optimistically update
            utils.user.get.setData({ userId: session.data?.user.id ?? "" }, (old) => {
                if (!old) {
                    return old;
                }
                return {
                    ...old,
                    preferences: {
                        ...old.preferences,
                        finishIntro: true
                    }
                }
            })
            return { previousData }; // pass context to onError
        },
        onError: (_err, _input, context) => {
            if (context?.previousData) {
                utils.user.get.setData({ userId: session.data?.user.id ?? "" }, context.previousData);
            }
        },
        onSettled: async () => {
            await utils.user.get.invalidate();
        },
    });


    return (
        <Dialog open={open} onOpenChange={v => { finishIntro.mutate(); setOpen(v) }}>
            <DialogContent className="max-w-md p-6 text-center">
                <div
                    className={`
      fixed top-1/2 left-1/2 z-50 w-full sm:max-w-lg max-w-[calc(100%-2rem)]
      translate-x-[-50%] translate-y-[-50%] rounded-lg border p-6 shadow-lg duration-200 bg-background
      data-[state=open]:animate-in data-[state=closed]:animate-out
      data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
      data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
    `}
                >
                    <Swiper
                        cssMode
                        navigation
                        pagination
                        mousewheel
                        keyboard
                        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                        className="mySwiper"
                        onSlideChange={(swiper) => {
                            const newRoute = slides[swiper.activeIndex]?.route;
                            if (newRoute) {
                                router.push(newRoute);
                            }
                        }}
                    >
                        {slides.map((slide, i) => (
                            <SwiperSlide key={i}>
                                <div className="flex flex-col items-center h-64 text-2xl font-semibold">
                                    <DialogTitle className="mt-12">{slide.title}</DialogTitle>
                                    <p className="text-sm max-w-[70%] mt-8">{slide.description}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="mt-6">
                    {isLast ? (
                        <Button
                            onClick={() => {
                                onComplete();
                                setOpen(false);
                                router.push("/dashboard"); // or wherever after finishing
                            }}
                            className="w-full"
                        >
                            Finish
                        </Button>
                    ) : (
                        <Button
                            onClick={() =>
                                setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
                            }
                            className="w-full"
                        >
                            Next
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
