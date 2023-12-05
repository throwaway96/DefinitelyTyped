import Service, { ActivityManager, Message } from "webos-service";

const service = new Service("test", null, { idleTimer: 99, noBuiltinMethods: false }); // $ExpectType Service
service.activityManager; // $ExpectType ActivityManager
service.activityManager.idleTimeout = 2;
service.useACG; // $ExpectType boolean
service.noBuiltinMethods ?? false; // $ExpectType boolean
service.call("luna://fake/method", {"param1": 123, "param2": "str", "param3": [1, "a"], "param4": {"asdf": "qwer"}}, (message: Message) => { message.payload; });

const sub = service.subscribe("test", {}); // $ExpectType Subscription
sub.uri; // $ExpectType string

const message = new Message({}, service.sendingHandle, service.activityManager, service); // $ExpectType Message

// @ts-expect-error
service.idleTimer = 5;

async function testActivity(service: Service): Promise<void> {
  const activity = {
    name: "fake.activity",
    description: "do something cool",
    type: {
      foreground: true,
      persist: true,
      continuous: true,
    },
    trigger: {
      method: "luna://com.palm.asdf/isReady",
      params: {
        subscribe: true,
      },
      where: {
        prop: ["signals", "whatever"],
        op: "=",
        val: false,
      },
    },
    callback: {
      method: "luna://com.palm.asdf.service/start",
      params: {
        param1: 1234,
        param2: "asdf",
        param3: ["str", -99.5],
      },
    },
  };

  const spec = {
    activity,
    start: true,
    replace: true,
  };


  return new Promise((resolve) => service.activityManager.create(spec, () => resolve()))
}

testActivity(service); // $ExpectType Promise<void>
