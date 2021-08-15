
const PENDING = "pending",
RESOLVED = "resolved",
REJECTED = "rejected"

class MyPromise {
changeStatus(newStatus, newValue, queue) {
    if (this.status !== PENDING) {
        return;
    }
    this.status = newStatus;
    this.value = newValue;
    queue.forEach(handler => handler(newValue));
}

constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.thenables = [];
    this.catchables = [];

    const resolve = data => {
        this.changeStatus(RESOLVED, data, this.thenables);
    }

    const reject = reason => {
        this.changeStatus(REJECTED, reason, this.catchables);
    }
    try {
        executor(resolve, reject)
    }
    catch (err) {
        reject(err);
    }
}

settleHandle(handler, immediatelyStatus, queue) {
    if (typeof handler !== "function") {
        return;
    }
    if (this.status === immediatelyStatus) {
        setTimeout(() => {
            handler(this.value);
        }, 0);
    }
    else {
        queue.push(handler);
    }
}

linkPromise(thenalbe, catchable) {
    function exec(data, handler, resolve, reject) {
        try {
            const result = handler(data);
            if (result instanceof MyPromise) {
                result.then(d => {
                    resolve(d)
                }, err => {
                    reject(err);
                })
            }
            else {
                resolve(result);
            }
        }
        catch (err) {
            reject(err);
        }
    }

    return new MyPromise((resolve, reject) => {
        this.settleHandle(data => {
            exec(data, thenalbe, resolve, reject);
        }, RESOLVED, this.thenables)

        this.settleHandle(reason => {
            exec(reason, catchable, resolve, reject);
        }, REJECTED, this.catchables)
    })
}

then(thenable, catchable) {
    return this.linkPromise(thenable, catchable);
}

catch(catchable) {

    return this.linkPromise(undefined, catchable);
}


static all(proms) {
    return new Promise((resolve, reject) => {
        const results = proms.map(p => {
            const obj = {
                result: undefined,
                isResolved: false
            }
            p.then(data => {
                obj.result = data;
                obj.isResolved = true;
                const unResolved = results.filter(r => !r.isResolved)
                if (unResolved.length === 0) {
                    resolve(results.map(r => r.result));
                }
            }, reason => {
                reject(reason);
            })
            return obj;
        })
    })
}

static race(proms) {
    return new Promise((resolve, reject) => {
        proms.forEach(p => {
            p.then(data => {
                resolve(data);
            }, err => {
                reject(err);
            })
        })
    })
}

static resolve(data) {
    if (data instanceof MyPromise) {
        return data;
    }
    else {
        return new MyPromise(resolve => {
            resolve(data);
        })
    }
}

static reject(reason) {
    return new MyPromise((_resolve, reject) => {
        reject(reason);
    })
}
}
