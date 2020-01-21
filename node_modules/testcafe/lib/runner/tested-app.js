"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
const tree_kill_1 = __importDefault(require("tree-kill"));
const os_family_1 = __importDefault(require("os-family"));
const delay_1 = __importDefault(require("../utils/delay"));
const runtime_1 = require("../errors/runtime");
const types_1 = require("../errors/types");
const resolve_path_relatively_cwd_1 = __importDefault(require("../utils/resolve-path-relatively-cwd"));
const MODULES_BIN_DIR = resolve_path_relatively_cwd_1.default('./node_modules/.bin');
const ENV_PATH_KEY = (function () {
    if (os_family_1.default.win) {
        let pathKey = 'Path';
        Object.keys(process.env).forEach(key => {
            if (key.toLowerCase() === 'path')
                pathKey = key;
        });
        return pathKey;
    }
    return 'PATH';
})();
class TestedApp {
    constructor() {
        this.process = null;
        this.errorPromise = null;
        this.killed = false;
    }
    async start(command, initDelay) {
        this.errorPromise = new Promise((resolve, reject) => {
            const env = Object.assign({}, process.env);
            const path = env[ENV_PATH_KEY] || '';
            const pathParts = path.split(path_1.delimiter);
            pathParts.unshift(MODULES_BIN_DIR);
            env[ENV_PATH_KEY] = pathParts.join(path_1.delimiter);
            this.process = child_process_1.exec(command, { env }, err => {
                if (!this.killed && err) {
                    const message = err.stack || String(err);
                    reject(new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.testedAppFailedWithError, message));
                }
            });
        });
        await Promise.race([
            delay_1.default(initDelay),
            this.errorPromise
        ]);
    }
    async kill() {
        this.killed = true;
        const killPromise = new Promise(resolve => tree_kill_1.default(this.process.pid, 'SIGTERM', resolve));
        await killPromise;
    }
}
exports.default = TestedApp;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGVkLWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvdGVzdGVkLWFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGlEQUFxQztBQUNyQywrQkFBa0Q7QUFDbEQsMERBQTZCO0FBQzdCLDBEQUEyQjtBQUMzQiwyREFBbUM7QUFDbkMsK0NBQWlEO0FBQ2pELDJDQUFpRDtBQUNqRCx1R0FBNEU7QUFFNUUsTUFBTSxlQUFlLEdBQUcscUNBQXdCLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUV4RSxNQUFNLFlBQVksR0FBRyxDQUFDO0lBQ2xCLElBQUksbUJBQUUsQ0FBQyxHQUFHLEVBQUU7UUFDUixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFckIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25DLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU07Z0JBQzVCLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQztLQUNsQjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFHTCxNQUFxQixTQUFTO0lBQzFCO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBUSxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBUyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLLENBQUUsT0FBTyxFQUFFLFNBQVM7UUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNoRCxNQUFNLEdBQUcsR0FBUyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakQsTUFBTSxJQUFJLEdBQVEsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMxQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFhLENBQUMsQ0FBQztZQUU1QyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBRW5DLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFhLENBQUMsQ0FBQztZQUVsRCxJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtvQkFDckIsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRXpDLE1BQU0sQ0FBQyxJQUFJLHNCQUFZLENBQUMsc0JBQWMsQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUM5RTtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDZixlQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxZQUFZO1NBQ3BCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNOLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBRW5CLE1BQU0sV0FBVyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUV2RixNQUFNLFdBQVcsQ0FBQztJQUN0QixDQUFDO0NBQ0o7QUF2Q0QsNEJBdUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHsgZGVsaW1pdGVyIGFzIHBhdGhEZWxpbWl0ZXIgfSBmcm9tICdwYXRoJztcbmltcG9ydCBraWxsIGZyb20gJ3RyZWUta2lsbCc7XG5pbXBvcnQgT1MgZnJvbSAnb3MtZmFtaWx5JztcbmltcG9ydCBkZWxheSBmcm9tICcuLi91dGlscy9kZWxheSc7XG5pbXBvcnQgeyBHZW5lcmFsRXJyb3IgfSBmcm9tICcuLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQgeyBSVU5USU1FX0VSUk9SUyB9IGZyb20gJy4uL2Vycm9ycy90eXBlcyc7XG5pbXBvcnQgcmVzb2x2ZVBhdGhSZWxhdGl2ZWx5Q3dkIGZyb20gJy4uL3V0aWxzL3Jlc29sdmUtcGF0aC1yZWxhdGl2ZWx5LWN3ZCc7XG5cbmNvbnN0IE1PRFVMRVNfQklOX0RJUiA9IHJlc29sdmVQYXRoUmVsYXRpdmVseUN3ZCgnLi9ub2RlX21vZHVsZXMvLmJpbicpO1xuXG5jb25zdCBFTlZfUEFUSF9LRVkgPSAoZnVuY3Rpb24gKCkge1xuICAgIGlmIChPUy53aW4pIHtcbiAgICAgICAgbGV0IHBhdGhLZXkgPSAnUGF0aCc7XG5cbiAgICAgICAgT2JqZWN0LmtleXMocHJvY2Vzcy5lbnYpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3BhdGgnKVxuICAgICAgICAgICAgICAgIHBhdGhLZXkgPSBrZXk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwYXRoS2V5O1xuICAgIH1cblxuICAgIHJldHVybiAnUEFUSCc7XG59KSgpO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlc3RlZEFwcCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLnByb2Nlc3MgICAgICA9IG51bGw7XG4gICAgICAgIHRoaXMuZXJyb3JQcm9taXNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5raWxsZWQgICAgICAgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBhc3luYyBzdGFydCAoY29tbWFuZCwgaW5pdERlbGF5KSB7XG4gICAgICAgIHRoaXMuZXJyb3JQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW52ICAgICAgID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvY2Vzcy5lbnYpO1xuICAgICAgICAgICAgY29uc3QgcGF0aCAgICAgID0gZW52W0VOVl9QQVRIX0tFWV0gfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBwYXRoUGFydHMgPSBwYXRoLnNwbGl0KHBhdGhEZWxpbWl0ZXIpO1xuXG4gICAgICAgICAgICBwYXRoUGFydHMudW5zaGlmdChNT0RVTEVTX0JJTl9ESVIpO1xuXG4gICAgICAgICAgICBlbnZbRU5WX1BBVEhfS0VZXSA9IHBhdGhQYXJ0cy5qb2luKHBhdGhEZWxpbWl0ZXIpO1xuXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3MgPSBleGVjKGNvbW1hbmQsIHsgZW52IH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmtpbGxlZCAmJiBlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGVyci5zdGFjayB8fCBTdHJpbmcoZXJyKTtcblxuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEdlbmVyYWxFcnJvcihSVU5USU1FX0VSUk9SUy50ZXN0ZWRBcHBGYWlsZWRXaXRoRXJyb3IsIG1lc3NhZ2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICAgIGRlbGF5KGluaXREZWxheSksXG4gICAgICAgICAgICB0aGlzLmVycm9yUHJvbWlzZVxuICAgICAgICBdKTtcbiAgICB9XG5cbiAgICBhc3luYyBraWxsICgpIHtcbiAgICAgICAgdGhpcy5raWxsZWQgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IGtpbGxQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBraWxsKHRoaXMucHJvY2Vzcy5waWQsICdTSUdURVJNJywgcmVzb2x2ZSkpO1xuXG4gICAgICAgIGF3YWl0IGtpbGxQcm9taXNlO1xuICAgIH1cbn1cbiJdfQ==