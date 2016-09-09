package org.wso2.carbon.notebook.api.endpoint.ml.preprocessor.algorithm;

import org.apache.spark.api.java.JavaRDD;
import org.wso2.carbon.ml.core.spark.transformations.MissingValuesFilter;
import org.wso2.carbon.ml.core.spark.transformations.RemoveResponseColumn;
import org.wso2.carbon.notebook.api.endpoint.dto.request.paragraph.FeatureRequest;
import org.wso2.carbon.notebook.api.endpoint.ml.preprocessor.transformation.DiscardedRowsFilter;
import org.wso2.carbon.notebook.api.endpoint.ml.preprocessor.transformation.HeaderFilter;
import org.wso2.carbon.notebook.api.endpoint.ml.preprocessor.transformation.LineToTokens;
import org.wso2.carbon.notebook.api.endpoint.ml.preprocessor.transformation.RemoveDiscardedFeatures;

import java.util.List;


public class DatasetPreprocessor {

    public List<String[]> preProcess(JavaRDD<String> lines, String header, String columnSeparator,
                                         List<FeatureRequest> features){
        List<String[]> resultantArray = null;
        try {

            HeaderFilter headerFilter = new HeaderFilter.Builder().init(header).build();

            LineToTokens lineToTokens = new LineToTokens.Builder().init(columnSeparator).build();

            DiscardedRowsFilter discardedRowsFilter = new DiscardedRowsFilter.Builder().init(features).build();
            RemoveDiscardedFeatures removeDiscardedFeatures = new RemoveDiscardedFeatures.Builder().init(features)
                    .build();
            RemoveResponseColumn responseColumnFilter = new RemoveResponseColumn();
            MissingValuesFilter missingValuesFilter = new MissingValuesFilter.Builder().build();
            JavaRDD<String[]> preprocessedLines = lines.filter(headerFilter).map(lineToTokens).filter(discardedRowsFilter)
                    .map(removeDiscardedFeatures).cache();
            resultantArray = preprocessedLines.collect();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (lines != null) {
                lines.unpersist();
            }
        }
        return resultantArray;
    }
}
