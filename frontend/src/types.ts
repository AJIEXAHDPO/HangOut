export type User = {
    name: string,
    fio: string,
    id: number,
    avatar: string,
    lastSeen: string,
    isOnline: boolean,
    isTyping: boolean,
    isVerified: boolean,
    isAdmin: boolean,
}

export type Call = {
    id: number,
    type: string, // "incoming" | "outgoing" | "missed"
    duration: string,
    finishedAt: string,
    status: string,
    user: User,
}

export type Contant = {
    user: User,
    isBlocked: boolean,
    isMuted: boolean,
}

export type Message = {
    type: "reject" | "candidate" | "offer" | "answer" | "ping" | "pong",
    payload: any,
    targetId: number,
}

export type IncomingMessage = {
    type: "reject" | "candidate" | "offer" | "answer" | "ping" | "pong",
    payload: any,
    targetId: number,
    fromUser: number,
}

export type Participant = {
    media: MediaStream,
    isVideo: boolean,
    isAudio: boolean,
    // user: User,
    name: string,
    isMe: boolean,
}