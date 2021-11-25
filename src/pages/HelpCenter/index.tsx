import React from 'react';
import _ from 'lodash';

import { useLanguages } from '@/hooks/useLanguages.hook';
import { Slide } from 'react-reveal';

import Section from './components/Section';
import Box from './components/Box';
import { QnAItem } from './components/QnAList';

const index = () => {
    const Lang = useLanguages();

    return (
        <main className="pt-5">
            {/* ************* Q&A ************* */}
            <Section>
                <Box className="p-3" title={Lang.help_cent_block_1_title}>
                    <QnAItem uuid={'qna11'} question={Lang.help_cent_question_1_1}>
                        {_.map(Lang.help_cent_answer_1_1.split('\n'), (line, i) => (
                            <span>
                                {line}
                                <br />
                            </span>
                        ))}
                    </QnAItem>
                    <QnAItem uuid={'qna12'} question={Lang.help_cent_question_1_2}>
                        {_.map(Lang.help_cent_answer_1_2.split('\n'), (line, i) => (
                            <span>
                                {line}
                                <br />
                            </span>
                        ))}
                    </QnAItem>
                    <QnAItem uuid={'qna13'} question={Lang.help_cent_question_1_3}>
                        {_.map(Lang.help_cent_answer_1_3.split('\n'), (line, i) => (
                            <span>
                                <br />
                                {line}
                            </span>
                        ))}
                        <a href={Lang.help_cent_answer_1_3_1} target="_blank">
                            https://chrome.google.com/webstore/detail/kaikas
                        </a>
                        {_.map(Lang.help_cent_answer_1_3_2.split('\n'), (line, i) => (
                            <span>
                                <br />
                                {line}
                            </span>
                        ))}
                        <a href={Lang.help_cent_answer_1_3_3} target="_blank">
                            {Lang.help_cent_answer_1_3_3}
                        </a>
                        {_.map(Lang.help_cent_answer_1_3_4.split('\n'), (line, i) => (
                            <span>
                                {line}
                                <br />
                            </span>
                        ))}
                    </QnAItem>
                    <QnAItem uuid={'qna14'} question={Lang.help_cent_question_1_4}>
                        {_.map(Lang.help_cent_answer_1_4.split('\n'), (line, i) => (
                            <span>
                                {line}
                                <br />
                            </span>
                        ))}
                    </QnAItem>

                    <QnAItem uuid={'qna15'} question={Lang.help_cent_question_1_5}>
                        {_.map(Lang.help_cent_answer_1_5.split('\n'), (line, i) => (
                            <span>
                                {line}
                                <br />
                            </span>
                        ))}
                    </QnAItem>

                    <QnAItem uuid={'qna16'} question={Lang.help_cent_question_1_6}>
                        {_.map(Lang.help_cent_answer_1_6.split('\n'), (line, i) => (
                            <span>
                                <br />
                                {line}
                            </span>
                        ))}
                        <a href={Lang.help_cent_answer_1_6_1} target="_blank">
                            Link
                        </a>
                    </QnAItem>

                    <QnAItem uuid={'qna17'} question={Lang.help_cent_question_1_7}>
                        {_.map(Lang.help_cent_answer_1_7.split('\n'), (line, i) => (
                            <span>{line}</span>
                        ))}
                    </QnAItem>
                </Box>
            </Section>
        </main>
    );
};

export default index;
