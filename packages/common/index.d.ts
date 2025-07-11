export namespace channel {
    namespace app {
        let getPath: string;
    }
    let dialog: string;
    namespace path {
        let resolve: string;
        let join: string;
        let sep: string;
    }
    namespace fs {
        let existsSync: string;
        let removeSync: string;
        let emptyDirSync: string;
        let ensureDirSync: string;
    }
    namespace store {
        let get: string;
        let set: string;
    }
    namespace git {
        let repositoryAuthUrl: string;
        let branchSummary: string;
        let logResult: string;
    }
}
export namespace config {
    let appTitle: string;
}

export function convertWindowsPathToUnix(winPath: string): string;
