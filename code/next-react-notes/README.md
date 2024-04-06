# next-react-notes

## dev

```shell
npm run dev
redis-server
```



## Note

1. SidebarNoteList组件使用的是服务端渲染，dayjs这种库不会打包到客户端的bundle中。

因此使用服务端组件的好处之一就是对客户端bundle size没有影响。
