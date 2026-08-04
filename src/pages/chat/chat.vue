<template>
    <view>
        <view class="chat-box" :style="'height: ' + contentHeight + ';'">
            <t-chat-list>
                <block v-for="(item, chatIndex) in chatList" :key="item.key">
                    <t-chat-message :chat-id="item.key" :avatar="item.avatar || ''" :name="item.name || ''"
                        :datetime="item.datetime || ''" :role="item.message.role"
                        :placement="item.message.role === 'user' ? 'right' : 'left'" @message-longpress="showPopover">
                        <template #content>
                            <block v-for="(contentItem, contentIndex) in item.message.content" :key="contentIndex">
                                <t-chat-content v-if="contentItem.type === 'text' || contentItem.type === 'markdown'"
                                    :content="contentItem" :role="item.message.role" :markdown-props="{
                                        ...chatContentProps,
                                        streaming:
                                            loading && chatIndex === 0 && item.message.role === 'assistant'
                                                ? { hasNextChunk: true, tail: true }
                                                : null,
                                    }" />
                            </block>
                        </template>
                        <template #actionbar>
                            <t-chat-actionbar v-if="
                                chatIndex !== chatList.length - 1 &&
                                item.message.status === 'complete' &&
                                item.message.role === 'assistant'
                            " :action-bar="customActionBar" @actions="handleAction" />
                        </template>
                    </t-chat-message>
                </block>
                <template #footer>
                    <t-chat-sender :visible="visible" :value="value" :loading="loading" :disabled="disabled"
                        :file-list="fileList" :attachments-props="attachmentsProps" :render-presets="renderPresets"
                        :auto-rise-with-keyboard="true" @update:visible="(e) => (visible = e)" @send="onSend"
                        @stop="onStop" @focus="onFocus" @keyboardheightchange="onkeyboardheightchange"
                        @updateVisible="onUpdateVisible" @fileDelete="onFileDelete" @fileChange="onFileChange" />
                </template>
            </t-chat-list>
            <!-- 长按弹出操作栏 -->
            <t-chat-actionbar ref="popoverActionbar" class="popover-actionbar" placement="longpress"
                :long-press-position="longPressPosition" @actions="handlePopoverAction" />
        </view>
        <t-toast ref="t-toast" />
    </view>
</template>

<script>
import { Toast } from '@tdesign/uniapp';
import TToast from '@tdesign/uniapp/toast/toast.vue';
import TChatActionbar from '@tdesign/uniapp-chat/chat-actionbar/chat-actionbar.vue';
import TChatContent from '@tdesign/uniapp-chat/chat-content/chat-content.vue';
import TChatList from '@tdesign/uniapp-chat/chat-list/chat-list.vue';
import TChatMessage from '@tdesign/uniapp-chat/chat-message/chat-message.vue';
import TChatSender from '@tdesign/uniapp-chat/chat-sender/chat-sender.vue';

import { getNavBarHeight } from '../../utils/format';

let uniqueId = 0;
const getUniqueKey = () => {
    uniqueId += 1;
    return `key-${uniqueId}`;
};

const fetchStream = async (message, history, options) => {
    const { success, complete, error: onError } = options;
    const token = uni.getStorageSync('auth')?.token || '';

    try {
        const response = await fetch('/api/ai/chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { clientToken: token } : {}),
            },
            body: JSON.stringify({ message, history }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';
        console.log('Response content-type:', contentType);

        if (contentType.includes('text/event-stream')) {
            // SSE 格式
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                // 支持 \n 和 \r\n 换行
                const lines = buffer.split(/\r?\n/);
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith(':')) continue;

                    // 兼容 "data: " 和 "data:"
                    const dataMatch = trimmed.match(/^data:\s?(.*)$/);
                    if (!dataMatch) continue;

                    const payload = dataMatch[1];
                    if (payload === '[DONE]') continue;

                    console.log('SSE chunk:', payload);
                    try {
                        const parsed = JSON.parse(payload);
                        // 兼容多种字段名
                        const text = parsed.content || parsed.text || parsed.message || parsed.delta || '';
                        if (text) success(text);
                    } catch {
                        // 非 JSON，直接作为文本
                        if (payload) success(payload);
                    }
                }
            }
        } else {
            // 非 SSE，直接读取完整响应
            const text = await response.text();
            console.log('Non-SSE response:', text);
            try {
                const parsed = JSON.parse(text);
                const content = parsed.content || parsed.text || parsed.message || parsed.data || text;
                success(content);
            } catch {
                success(text);
            }
        }
        complete();
    } catch (err) {
        console.error('fetchStream error:', err);
        onError && onError(err);
        complete();
    }
};
export default {
    components: {
        TChatMessage,
        TChatContent,
        TChatList,
        TChatSender,
        TChatActionbar,
        TToast,
    },
    props: {
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            customActionBar: ['copy', 'good', 'bad'],

            chatList: [
                {
                    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
                    key: getUniqueKey(),
                    message: {
                        role: 'assistant',
                        content: [
                            {
                                type: 'text',
                                data: '欢迎使用TDesign文案写作助手，可以先上传你需要参考的文件，输入你要撰写的主题~',
                            },
                        ],
                    },
                },
            ],

            value: '',

            // 输入框的值
            loading: false,

            // 加载状态
            disabled: false,

            // 禁用状态
            inputStyle: '',

            // 动态样式
            attachmentsProps: {
                items: [],
                removable: true,
                imageViewer: true,
            },

            renderPresets: [
                {
                    name: 'upload',
                    presets: ['uploadCamera', 'uploadImage', 'uploadAttachment'],
                    status: '',
                },
                {
                    name: 'send',
                    type: 'icon',
                },
            ],

            fileList: [],
            visible: false,

            // 是否显示选择文件面板
            chatContentProps: {
                thinking: {
                    maxHeight: 100,
                    collapsed: true,
                },
            },

            // 内容高度
            contentHeight: '100vh',

            chatIndex: 0,
            activePopoverId: '', // 当前打开悬浮actionbar的chatId
            longPressPosition: null, // 长按位置对象
        };
    },
    watch: {
        isActive: {
            handler(v) {
                // 延迟 30ms，避免 hidden 场景下， value 变更无法触发 textarea 的自动换行
                // 代码片段（iOS 真机可复现）：https://developers.weixin.qq.com/s/7UoAYgmr8G4k
                setTimeout(() => {
                    this.value = v ? '根据所提供的材料总结一篇文章，推荐春天户外郊游打卡目的地，需要符合小红书平台写作风格' : ''; // 输入框的值
                }, 30);
            },

            immediate: true,
        },
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    created() { },
    methods: {
        attached() {
            try {
                // 获取当前的导航栏高度和安全区域高度
                
                const navigationBarHeight = getNavBarHeight() || 0;
                console.log('bar height:' + navigationBarHeight);
                // 生成CSS calc表达式字符串 ${navigationBarHeight}
                const contentHeight = `calc(100vh - 96rpx - ${navigationBarHeight}rpx)`;
                this.contentHeight = contentHeight;
                console.log('内容区域高度CSS表达式:', contentHeight);
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('生成内容高度表达式失败:', error);
                this.contentHeight = 'calc(100vh - 96rpx)';
            }
        },

        // 发送消息事件处理
        onSend(e) {
            const { value } = e;
            if (!value || value.trim() === '') {
                return;
            }

            // 创建用户消息对象
            const content = [
                {
                    type: 'text',
                    data: value.trim(),
                },
            ];
            const attachments = this.attachmentsProps.items.map((item) => ({
                ...item,
                status: 'success',
            }));
            content.unshift({
                type: 'attachment',
                data: attachments,
            });
            this.attachmentsProps = {
                ...this.attachmentsProps,
                items: [],
            };
            this.fileList = [];

            const userMessage = {
                key: getUniqueKey(),
                message: {
                    role: 'user',
                    content,
                },
            };

            // 将用户消息插入到chatList的开头（因为reverse为true，所以用unshift）
            this.chatList = [userMessage, ...this.chatList];
            this.value = ''; // 清空输入框

            // 模拟助手回复（可选）
            this.simulateAssistantReply(value.trim());
        },

        // 停止事件处理
        onStop() {
            console.log('停止发送');
            this.loading = false;
        },

        // 聚焦事件处理
        onFocus() {
            console.log('输入框聚焦');
        },

        // 打开选择文件界面
        onUpdateVisible(e) {
            const visible = e;
            console.log('上传面板显示状态:', visible);
            this.visible = visible;
        },

        onFileDelete() {
            this.attachmentsProps = {
                ...this.attachmentsProps,
                items: [],
            };
        },

        onFileChange(e) {
            const { files } = e;
            this.attachmentsProps = {
                ...this.attachmentsProps,
                items: files,
            };
            this.fileList = files;
        },

        // 模拟助手回复
        simulateAssistantReply(userMessage) {
            this.loading = true;

            // 构建历史消息（排除欢迎语，按时间顺序排列）
            const history = [];
            const reversed = [...this.chatList].reverse();
            for (const item of reversed) {
                if (item.message.role === 'user') {
                    history.push({ role: 'user', content: item.message.content[0]?.data || '' });
                } else if (item.message.role === 'assistant' && item.message.status === 'complete') {
                    history.push({ role: 'assistant', content: item.message.content[0]?.data || '' });
                }
            }

            const assistantMessage = {
                avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
                key: getUniqueKey(),
                message: {
                    role: 'assistant',
                    content: [
                        {
                            type: 'markdown',
                            data: '',
                        },
                    ],
                },
            };
            this.chatList = [assistantMessage, ...this.chatList];
            const that = this;
            this.$nextTick(() => {
                fetchStream(userMessage, history, {
                    success(result) {
                        if (!that.loading) return;
                        that.chatList[0].message.content[0].data += result;
                    },
                    complete() {
                        that.chatList[0].message.status = 'complete';
                        that.loading = false;
                    },
                    error() {
                        that.chatList[0].message.content[0].data = '请求失败，请重试';
                        that.chatList[0].message.status = 'complete';
                        that.loading = false;
                    },
                });
            });
        },

        handleAction(e) {
            const { name, active, data } = e;
            let message = '';
            switch (name) {
                case 'replay':
                    message = '重新生成';
                    break;
                case 'copy':
                    console.log(data);
                    message = '复制成功';
                    break;
                case 'good':
                    message = active ? '点赞成功' : '取消点赞';
                    break;
                case 'bad':
                    message = active ? '点踩成功' : '取消点踩';
                    break;
                case 'share':
                    message = '分享功能';
                    break;
                default:
                    message = `执行了${name}操作`;
            }
            Toast({
                context: this,
                selector: '#t-toast',
                message,
                theme: 'success',
            });
        },

        // 显示长按弹出操作栏
        showPopover(e) {
            const { id, longPressPosition } = e;

            let role = '';
            this.chatList.forEach((item) => {
                if (item.key === id) {
                    role = item.message.role;
                }
            });

            // 仅当 role 为 user 时才显示 popover
            if (role !== 'user') {
                return;
            }

            this.activePopoverId = id;
            this.longPressPosition = longPressPosition;
        },

        // 处理弹出操作栏的事件
        handlePopoverAction(e) {
            e.chatId = this.activePopoverId;
            this.handleAction(e);
        },

        onkeyboardheightchange() {
            console.log('占位：函数 onkeyboardheightchange 未声明');
        },
    },

    onNavigationBarButtonTap(e) {
    // e.index 可以区分你点击的是哪个按钮
    console.log('导航栏按钮被点击了：', e);
    if (e.index === 0) {
      // 执行筛选功能
    }
  }
};
</script>
<style>
.chat-box {
    padding-top: 32rpx;
    box-sizing: border-box;
}

.t-chat__list {
    padding: 0 0 0 32rpx;
    box-sizing: border-box;
}

.t-chat-message {
    padding: 0 32rpx;
}

.preview {
    padding: 16rpx;
    display: flex;
    justify-content: space-between;
    border: 1px solid black;
}
</style>