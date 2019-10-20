declare var nprocess: Process;

interface Process {
    env: Env
}

interface Env {
    GOOGLE_CLIENT_ID: string
}

interface GlobalEnvironment {
    nprocess: Process
}

